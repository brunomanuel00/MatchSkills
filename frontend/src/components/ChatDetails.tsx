import { useChat } from './context/ChatContext';
import { useAuth } from './context/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCheck, ChevronDown, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';

export default function ChatDetail() {
    const { user } = useAuth();
    const { messages, sendMessage, activeChat, isTypingFromOther, handleTypingInput, setActiveChat, handleDeleteMessage } = useChat();
    const [input, setInput] = useState('');
    const { i18n, t } = useTranslation();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const currentChatRef = useRef<string | null>(null);
    const isUserAtBottom = useRef(true);
    const [optionMessageOpenId, setOptionMessageOpenId] = useState<string | null>(null)
    const optionMessage = useRef<HTMLDivElement>(null)
    const [isDeleteMessageModalOpen, setIsDeleteMessageModalOpen] = useState<boolean>(false)

    // Este efecto maneja EXCLUSIVAMENTE el cambio entre chats
    useEffect(() => {
        // Detectar cambio de chat activo
        if (activeChat !== currentChatRef.current) {
            // Actualizar referencia del chat actual
            currentChatRef.current = activeChat;

            // Esperar a que el DOM se actualice y luego ir al final del contenedor
            // Sin animación (behavior: 'auto')
            setTimeout(() => {
                const container = messagesContainerRef.current;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 0);
        }
    }, [activeChat]);

    // Este efecto maneja EXCLUSIVAMENTE los nuevos mensajes
    useEffect(() => {
        // Solo ejecutar si hay mensajes y no es un cambio de chat
        if (messages.length && currentChatRef.current === activeChat) {
            const container = messagesContainerRef.current;
            if (!container) return;

            // Si el usuario está cerca del final (o está en el fondo), desplazar al final
            if (isUserAtBottom.current) {
                setTimeout(() => {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth' // Animación suave solo para nuevos mensajes
                    });
                }, 50);
            } else {
                // Si no está en el fondo, posiblemente incrementar contador de no vistos
                const lastMessage = messages[messages.length - 1];
                if (lastMessage && user && lastMessage.receiverId._id === user.id && !lastMessage.read) {
                    setUnseenMessagesCount(prev => prev + 1);
                }
            }
        }
    }, [messages, activeChat, user]);

    // Manejar scroll del usuario
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Actualizar posición del scroll
        const scrollBottom = container.scrollTop + container.clientHeight;
        const isAtBottom = container.scrollHeight - scrollBottom <= 50;

        // Actualizar refs y estados
        isUserAtBottom.current = isAtBottom;

        // Mostrar/ocultar botón de scroll según la posición
        setShowScrollButton(!isAtBottom);

        // Marcar mensajes como leídos cuando está cerca del final
        if (isAtBottom) {
            setUnseenMessagesCount(0);
        }
    }, []);

    // Configurar event listeners de scroll
    useEffect(() => {
        const container = messagesContainerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    //Formato para el tiempo que ha transcurrido desde el ultimo mensaje
    const formatMessageDate = (timestamp: Date) => {
        const date = new Date(timestamp);
        const locale = i18n.language === 'es' ? es : enUS;

        return format(date, i18n.language === 'es'
            ? "d 'de' MMMM yyyy, HH:mm"
            : "d MMM yyyy, h:mm a", { locale });
    };

    const handleSubmit = async () => {
        if (input.trim()) {
            await sendMessage(input);
            setInput('');
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setActiveChat(null);
        }
    }, [setActiveChat]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionMessage.current && !optionMessage.current.contains(event.target as Node)) {
                setOptionMessageOpenId(null);
            }
        };

        // Usar 'click' en lugar de 'mousedown' para mejor consistencia
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    const handleToggleOptions = useCallback((messageId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOptionMessageOpenId(current =>
            current === messageId ? null : messageId
        );
    }, []);

    const closeDeleteMessageModal = useCallback(() => {
        setIsDeleteMessageModalOpen(false)
    }, [])


    return (
        <div className="flex flex-col w-full h-full pb-2 ">
            <div className='w-full flex justify-start my-auto p-2 h-14 rounded-e-sm bg-slate-100 dark:bg-cyan-800 '>
                {activeChat &&
                    <button
                        onClick={() => setActiveChat(null)}
                        onKeyDown={() => handleKeyDown}
                        className='flex justify-center items-center mr-2 rounded-full'
                    >
                        <ArrowLeft className='h-5 w-5 md:hidden text-black' />
                    </button>
                }
                <div className="flex items-center gap-2 ">
                    <img
                        src={
                            messages.length > 0
                                ? messages[0].senderId._id === activeChat
                                    ? messages[0].senderId.avatar?.url
                                    : messages[0].receiverId.avatar?.url
                                : 'default-avatar-url'
                        }
                        className="w-8 h-8 rounded-full"
                        alt="Avatar"
                    />
                    <div>
                        <h2 className="font-semibold text-sm">
                            {
                                messages.length > 0
                                    ? messages[0].senderId._id === activeChat
                                        ? messages[0].senderId.name
                                        : messages[0].receiverId.name
                                    : 'default-avatar-url'
                            }
                        </h2>
                        <span>
                            {isTypingFromOther && (
                                <div className="text-sm italic text-gray-500 animate-pulse">
                                    {t('chat.typing')}
                                </div>
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(message => {
                    const isOwnMessage = user?.id === message.receiverId?._id;
                    const timestamp = formatMessageDate(message.timestamp);

                    return (
                        <div className={`flex relative ${isOwnMessage ? 'justify-start' : 'justify-end'} `} key={message.id}>

                            <div className={`${isOwnMessage
                                ? 'bg-green-200 dark:bg-teal-600'
                                : 'bg-emerald-400 dark:bg-teal-700'
                                } rounded-md max-w-[50%] p-3  flex flex-col group/message transition-all duration-200`}>

                                <div className='relative h-1'>
                                    <span onClick={(e) => handleToggleOptions(message.id, e)} className={`
                                           absolute hidden group-hover/message:flex
                                           right-1 -top-3
                                           items-center justify-center cursor-pointer`}
                                    >
                                        ...
                                    </span>

                                    {optionMessageOpenId === message.id &&
                                        <div ref={optionMessage}>
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 5 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-32 text-center hover:bg-slate-300 p-2 bg-white dark:bg-lapis_lazuli-500 rounded-md shadow-lg py-1 z-50"
                                            >
                                                <button onClick={() => {
                                                    setIsDeleteMessageModalOpen(true)
                                                }}>
                                                    {t('table.delete')}
                                                </button>
                                            </motion.div>
                                        </div>

                                    }

                                </div>


                                <p className="text-black dark:text-white break-words">{message.content}</p>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-200 ">
                                        {timestamp}
                                    </span>
                                    {!isOwnMessage &&
                                        (message.read ? (
                                            <span className="text-xs mx-2 text-blue-700 dark:text-sky-500">
                                                <CheckCheck className='h-4 w-4' />
                                            </span>
                                        ) : (
                                            <span className="text-xs mx-2 text-gray-600">
                                                <CheckCheck className='h-4 w-4' />
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
                {(unseenMessagesCount > 0 || showScrollButton) && (
                    <button
                        onClick={() => {
                            messagesContainerRef.current?.scrollTo({
                                top: messagesContainerRef.current.scrollHeight,
                                behavior: 'smooth'
                            });
                            setUnseenMessagesCount(0);
                        }}
                        className="sticky bottom-4 left-full bg-green-700 dark:bg-teal-500 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-600 transition-transform"
                    >
                        <div className='flex flex-col'>
                            <ChevronDown className='h-6 w-6' />
                            {unseenMessagesCount > 0 && <span className=' font-semibold'> {unseenMessagesCount}</span>}
                        </div>
                    </button>
                )}
            </div>

            <div className="p-2 flex gap-2">
                <textarea
                    className="flex-1 resize-none border rounded px-3 py-2 dark:bg-cyan-800 dark:placeholder-gray-300"
                    value={input}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleTypingInput(value);
                        setInput(value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    placeholder={t('chat.write')}
                    rows={1}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="bg-teal-600 max-h-10 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    <div className='flex justify-center items-center gap-2'>
                        <span className='hidden md:flex' >
                            {t('chat.sent-message')}
                        </span>
                        <span className='sr-only'>
                            {t('chat.sent-message')}
                        </span>
                        <Send className='h-5 w-5' />
                    </div>
                </button>
            </div>
            <Modal
                isOpen={isDeleteMessageModalOpen}
                onClose={closeDeleteMessageModal}
                title={t('modal.delete-message.title')}
                size='sm'
            >
                <h2>Are you sure do  you want delete this message</h2>
                <div className='flex justify-center items-center m-3 gap-4'>
                    <button
                        onClick={closeDeleteMessageModal}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                    >
                        {t("modal.delete-account.cancel")}
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteMessage(optionMessageOpenId)
                            closeDeleteMessageModal()

                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        {t("modal.delete-account.accept")}
                    </button>
                </div>

            </Modal>
        </div>
    );
}