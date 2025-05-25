import axios from "axios";
import { Chat, Message } from "../types/utils";

const baseUrl = "/api/messages";

const getChatList = async (): Promise<Chat[]> => {
    const response = await axios.get(`${baseUrl}/chats/list`, {
        withCredentials: true
    });
    return response.data
    // .map((chat: any) => ({
    //     ...chat,
    //     lastMessage: {
    //         ...chat.lastMessage,
    //         timestamp: new Date(chat.lastMessage.timestamp),
    //         senderId: {
    //             _id: chat.lastMessage.senderId._id,
    //             name: chat.lastMessage.senderId.name,
    //             avatar: chat.lastMessage.senderId.avatar
    //         },
    //         receiverId: {
    //             _id: chat.lastMessage.receiverId._id,
    //             name: chat.lastMessage.receiverId.name,
    //             avatar: chat.lastMessage.receiverId.avatar
    //         }
    //     }
    // }));
};

const getChatMessages = async (userId: string): Promise<Message[]> => {
    // Validar ObjectId antes de hacer la petición
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        throw new Error('ID de usuario inválido');
    }

    const response = await axios.get(`${baseUrl}/${userId}`, {
        withCredentials: true
    });

    return response.data.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
        senderId: {
            _id: message.senderId._id,
            name: message.senderId.name,
            avatar: message.senderId.avatar
        },
        receiverId: {
            _id: message.receiverId._id,
            name: message.receiverId.name,
            avatar: message.receiverId.avatar
        }
    }));
};

const sendMessage = async (payload: {
    receiverId: string;
    content: string
}): Promise<Message> => {
    const response = await axios.post(baseUrl, payload, {
        withCredentials: true
    });

    return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
        senderId: {
            _id: response.data.senderId._id,
            name: response.data.senderId.name,
            avatar: response.data.senderId.avatar
        },
        receiverId: {
            _id: response.data.receiverId._id,
            name: response.data.receiverId.name,
            avatar: response.data.receiverId.avatar
        }
    };
};

const markAsRead = async (messageIds: string[]) => {
    const response = await axios.patch('/api/messages/read', {
        messageIds
    });
    return response.data;
};

export default {
    getChatList,
    getChatMessages,
    sendMessage,
    markAsRead
};