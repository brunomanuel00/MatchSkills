import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import messagesService from '../../services/messagesService';
import { Chat, Message } from '../../types/utils';

type ChatContextType = {
    socket: Socket | null;
    activeChat: string | null;
    chats: Chat[];
    messages: Message[];
    unReadTotal: number;
    setActiveChat: (userId: string | null) => void;
    sendMessage: (content: string) => Promise<void>;
    markAsRead: (messagesIds: string[]) => void;
    isTypingFromOther: boolean;
    loadChats: () => void
    handleTypingInput: (input: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTypingFromOther, setIsTypingFromOther] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [unReadTotal, setUnReadTotal] = useState<number>(0)

    // Socket.io connection
    useEffect(() => {
        if (!user) return;

        const newSocket = io("https://localhost:3001", {
            withCredentials: true,
            query: { userId: user.id }
        });

        const handleNewMessage = (message: Message) => {
            console.log('📨 Nuevo mensaje recibido:', message);
            setMessages(prev => [...prev, message]);
            setChats(prev => updateChats(prev, message, user.id));

            // Si este mensaje fue recibido y el chat está activo, marcarlo como leído automáticamente
            if (message.receiverId._id === user.id && message.senderId._id === activeChat && !message.read) {
                console.log('🔄 Auto-marcando mensaje como leído');
                handleMarkAsRead([message.id]);
            }
            loadChats();
        };

        const handleMessagesRead = ({ messageIds, readerId }: { messageIds: string[], readerId: string }) => {
            console.log('✅ Evento messages_read recibido:', { messageIds, readerId, currentUserId: user.id });

            // Solo actualizar si NOSOTROS somos el emisor de esos mensajes
            // (readerId es quien leyó nuestros mensajes)
            if (readerId !== user.id) {
                console.log('📝 Actualizando mensajes como leídos en UI');
                setMessages(prev => prev.map(msg => {
                    if (messageIds.includes(msg.id) && msg.senderId._id === user.id) {
                        console.log(`✓ Mensaje ${msg.id} marcado como leído`);
                        return { ...msg, read: true };
                    }
                    return msg;
                }));
            }
        };

        newSocket.on('new_message', handleNewMessage);
        newSocket.on('messages_read', handleMessagesRead);

        setSocket(newSocket);

        return () => {
            newSocket.off('new_message', handleNewMessage);
            newSocket.off('messages_read', handleMessagesRead);
            newSocket.disconnect();
        };
    }, [user, activeChat]);

    //Efecto para establecer en el map del socket el chat que este activo o no
    useEffect(() => {
        if (socket && user) {
            socket.emit('set_active_chat', activeChat)

            // Si hay un chat activo, buscar mensajes no leídos y marcarlos como leídos
            if (activeChat) {
                const unreadMessages = messages.filter(msg => !msg.read && msg.receiverId._id === user.id && msg.senderId._id === activeChat)

                if (unreadMessages.length > 0) {
                    const messagesId = unreadMessages.map(msg => msg.id)
                    handleMarkAsRead(messagesId)
                }
            }
        }
    }, [activeChat, messages, socket, user])

    useEffect(() => {
        if (!socket || !activeChat) return;

        const handleTyping = ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
            if (senderId === activeChat) {
                setIsTypingFromOther(isTyping);

                // Auto apagar typing después de 2s
                if (isTyping && typingTimeout) clearTimeout(typingTimeout);
                if (isTyping) {
                    const timeout = setTimeout(() => {
                        setIsTypingFromOther(false);
                    }, 2000);
                    setTypingTimeout(timeout);
                }
            }
        };

        socket.on('typing', handleTyping);

        return () => {
            socket.off('typing', handleTyping);
        };
    }, [socket, activeChat, typingTimeout]);

    const loadChats = async () => {
        if (user) {
            try {
                const data = await messagesService.getChatList();
                const countUnread = data.reduce((acc, curr) => acc + curr.unreadCount, 0)
                setUnReadTotal(countUnread);

                data.sort((a, b) => {
                    const aTimestamp = new Date(a.lastMessage.timestamp).getTime();
                    const bTimestamp = new Date(b.lastMessage.timestamp).getTime();
                    return bTimestamp - aTimestamp;
                });

                setChats(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error loading chats:", error);
            }
        }
    };

    // Load initial chats
    useEffect(() => {
        loadChats();
    }, [user]);

    // Load messages when active chat changes
    const loadMessages = useCallback(async () => {
        if (activeChat && user) {
            try {
                const data = await messagesService.getChatMessages(activeChat);
                setMessages(data);

                // Filtrar mensajes no leídos RECIBIDOS por el usuario actual
                const unreadMessages = data.filter(msg =>
                    !msg.read &&
                    msg.receiverId._id === user.id &&
                    msg.senderId._id === activeChat // Este debe ser el chat activo
                );

                console.log(`📨 Mensajes no leídos encontrados:`, unreadMessages.length);

                if (unreadMessages.length > 0) {
                    const messageIds = unreadMessages.map(msg => msg.id);

                    // Verificar IDs válidos
                    const validIds = messageIds.filter(id =>
                        /^[0-9a-fA-F]{24}$/.test(id)
                    );

                    if (validIds.length > 0) {
                        console.log(`📤 Marcando como leídos:`, validIds);
                        await handleMarkAsRead(validIds);
                    }
                }

            } catch (error) {
                console.error("❌ Error loading messages:", error);
            }
        }
    }, [activeChat, user]);

    useEffect(() => {
        loadMessages();
    }, [activeChat, user]);

    const updateChats = useCallback((prevChats: Chat[], message: Message, userId: string) => {

        // Determinar si el usuario actual es el remitente
        const isSender = message.senderId._id === userId;
        const otherUser = isSender ? message.receiverId : message.senderId;

        const updatedChats = prevChats
            .map(chat =>
                chat.user._id === otherUser._id
                    ? {
                        ...chat,
                        lastMessage: message,
                        unreadCount: isSender
                            ? chat.unreadCount // Si enviamos el mensaje, no sumar no leídos
                            : !message.read
                                ? chat.unreadCount + 1
                                : chat.unreadCount
                    }
                    : chat
            )
            .sort((a, b) => {
                const aTimestamp = new Date(a.lastMessage.timestamp).getTime();
                const bTimestamp = new Date(b.lastMessage.timestamp).getTime();
                return bTimestamp - aTimestamp;
            });

        const countUnread = updatedChats.reduce((acc, curr) => acc + curr.unreadCount, 0);
        setUnReadTotal(countUnread);

        return updatedChats;
    }, []);

    const handleSend = useCallback(async (content: string) => {
        if (!activeChat || !user) return;
        // const userProvitional = messages[0].receiverId

        const tempId = `temp-${Date.now()}`;
        // Crear mensaje temporal con estructura completa
        const newMessage: Message = {
            id: tempId,
            senderId: {
                _id: user.id,
                name: user.name,
                avatar: user.avatar
            },
            receiverId: {
                _id: activeChat,
                name: '', // Necesitarías obtener esta info del estado
                avatar: { public_id: '', url: '' }
            },
            content,
            timestamp: new Date(),
            read: false
        };

        setMessages(prev => [...prev, newMessage]);
        setChats(prev => updateChats(prev, newMessage, user.id));

        try {
            const savedMessage = await messagesService.sendMessage({
                receiverId: activeChat,
                content
            });

            // Reemplazar mensaje temporal con el real
            setMessages(prev =>
                prev.map(msg => msg.id === tempId
                    ? {
                        ...savedMessage,
                        timestamp: new Date(savedMessage.timestamp),
                        // Asegurar que los IDs son objetos
                        senderId: {
                            _id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        },
                        receiverId: {
                            _id: activeChat,
                            name: "", // Deberías tener esta info en el estado
                            avatar: { public_id: "", url: "" }
                        }
                    }
                    : msg
                )
            );
        } catch (error) {
            // Rollback
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            console.error("Error sending message:", error);
        }
    }, [activeChat, user, updateChats]);

    const handleMarkAsRead = useCallback(async (messagesIds: string[]) => {
        if (!user) return;

        console.log(`📖 Marcando como leídos ${messagesIds.length} mensajes para usuario ${user.id}`);

        try {
            // 1. Optimistic update en el frontend
            setMessages(prev => prev.map(msg =>
                messagesIds.includes(msg.id) && msg.receiverId._id === user.id
                    ? { ...msg, read: true }
                    : msg
            ));

            setChats(prev => {
                const updatedChats = prev.map(chat => {
                    if (chat.user._id === activeChat) {
                        return {
                            ...chat,
                            unreadCount: 0
                        };
                    }
                    return chat;
                });

                const countUnread = updatedChats.reduce((acc, curr) => acc + curr.unreadCount, 0);
                setUnReadTotal(countUnread);
                return updatedChats;
            });

            // 2. Llamar al servicio API - AQUÍ es donde se envía la notificación
            const response = await messagesService.markAsRead(messagesIds);
            console.log(`✅ Respuesta del servidor:`, response);

            // 3. NO necesitas emitir evento socket aquí, el backend ya lo hace

        } catch (error) {
            console.error('❌ Error al marcar mensajes como leídos:', error);

            // Rollback en caso de error
            setMessages(prev => prev.map(msg =>
                messagesIds.includes(msg.id)
                    ? { ...msg, read: false }
                    : msg
            ));
        }
    }, [user, activeChat]);

    const handleTypingInput = useCallback((input: string) => {
        if (!socket || !activeChat || !user) return;

        const isTyping = input.trim().length > 0;

        socket.emit('typing', {
            senderId: user.id,
            receiverId: activeChat,
            isTyping,
        });

        if (typingTimeout) clearTimeout(typingTimeout);
        if (isTyping) {
            const timeout = setTimeout(() => {
                socket.emit('typing', {
                    senderId: user.id,
                    receiverId: activeChat,
                    isTyping: false,
                });
            }, 1000);
            setTypingTimeout(timeout);
        }
    }, [socket, activeChat, user, typingTimeout]);

    return (
        <ChatContext.Provider
            value={{
                socket,
                activeChat,
                chats,
                messages,
                setActiveChat,
                unReadTotal,
                loadChats,
                sendMessage: handleSend,
                markAsRead: handleMarkAsRead,
                isTypingFromOther,
                handleTypingInput
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
