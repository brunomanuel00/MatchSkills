import axios from "axios";
import { Chat, Message } from "../types/utils";

const baseUrl = "/api/messages";

const getChatList = async (): Promise<Chat[]> => {
    const response = await axios.get(`${baseUrl}/chats/list`, {
        withCredentials: true
    });
    return response.data
};

const getChatMessages = async (userId: string): Promise<Message[]> => {

    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        throw new Error('Invalid user id');
    }

    const response = await axios.get(`${baseUrl}/${userId}`, {
        withCredentials: true
    });

    return response.data.map((message: Message) => ({
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

const deleteMessage = async (id: string) => {
    const response = await axios.delete(`/api/messages/${id}`);
    return response.data;
}

const deleteChat = async (otherId: string) => {
    const response = await axios.delete(`/api/messages/chat/${otherId}`);
    return response.data;
}

export default {
    getChatList,
    getChatMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    deleteChat
};