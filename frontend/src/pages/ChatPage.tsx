import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDistance } from 'date-fns';
import ChatDetail from '../components/ChatDetails';
import { useChat } from '../components/context/ChatContext';
import { useTranslation } from 'react-i18next';
import { es, enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Modal } from '../components/Modal';



export default function ChatPage() {
    const { chats, setActiveChat, activeChat, loadChats, handleDeleteChat } = useChat()
    const { t, i18n } = useTranslation()
    const optionChat = useRef<HTMLDivElement>(null)
    const [optionChatIdOpen, setOptionChatIdOpen] = useState<string | null>(null)
    const [isDeleteChatOpen, setIsDeleteChatOpen] = useState<boolean>(false)

    useEffect(() => {
        loadChats()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionChat.current && !optionChat.current.contains(event.target as Node)) {
                setOptionChatIdOpen(null);
            }
        };

        // Usar 'click' en lugar de 'mousedown' para mejor consistencia
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    const handleToggleOptions = useCallback((chatId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setOptionChatIdOpen(current =>
            current === chatId ? null : chatId
        );
    }, [])

    const handleModalClose = useCallback(() => {
        setIsDeleteChatOpen(false)
    }, [])

    const currentLocale = i18n.language === 'es' ? es : enUS;

    return (
        <div className=" min-h-screen pt-14 items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">

            <div className="flex relative min-h-[650px] max-h-[650px] rounded-md mt-10 bg-white dark:bg-cyan-950">

                {/* Lista */}
                <div className={`md:border-r md:dark:border-r-teal-800 w-full md:w-1/3 ${activeChat ? 'hidden md:block' : 'block'} overflow-auto`}>
                    <h2 className="sticky my-1 rounded-s-md h-14 -translate-y-1 z-10 bg-white dark:bg-cyan-800 p-4 text-lg font-bold">{t('chat.chats')}</h2>
                    <ul>
                        {chats.map(c => {
                            let formattedTime = formatDistance(
                                new Date(c.lastMessage.timestamp),
                                new Date(),
                                {
                                    locale: currentLocale,
                                    addSuffix: false,
                                }
                            );

                            // Eliminar "about" (inglés) o "alrededor de" (español) si aparece
                            formattedTime = formattedTime
                                .replace(/^about\s/, '')           // remove "about "
                                .replace(/^alrededor de\s/, '');   // remove "alrededor de "

                            const displayTime = i18n.language === 'es'
                                ? `hace ${formattedTime}`
                                : `${formattedTime} ago`;

                            return (
                                <li
                                    key={c.user._id}
                                    onClick={() => {
                                        setActiveChat(c.user?._id);
                                    }}
                                    className="p-4 hover:bg-gray-100 dark:hover:bg-cyan-800 cursor-pointer flex items-center group/chat"
                                >
                                    {c.user.avatar && (
                                        <img
                                            src={c.user.avatar.url}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold">{c.user.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400 max-w-[150px] truncate">
                                            {c.lastMessage.content}
                                        </p>
                                    </div>
                                    {/* Delete a chat */}
                                    <div className='relative h-1'>
                                        <span
                                            onClick={(e) => handleToggleOptions(c.user._id, e)}
                                            className={`
                                           absolute hidden group-hover/chat:flex
                                           right-1 -top-3
                                           items-center justify-center cursor-pointer`}
                                        >
                                            ...
                                        </span>

                                        {optionChatIdOpen === c.user._id &&
                                            <div ref={optionChat}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 5 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute right-5 -top-6 mt-2 w-32 text-center hover:bg-slate-300 p-2 bg-white dark:bg-lapis_lazuli-500 rounded-md shadow-lg py-1 z-50"
                                                >
                                                    <button
                                                        className='w-full h-full'
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setIsDeleteChatOpen(true)
                                                        }}
                                                    >
                                                        {t('table.delete')}
                                                    </button>
                                                </motion.div>
                                            </div>

                                        }

                                    </div>
                                    <div className='flex flex-col items-end'>
                                        {c.unreadCount !== 0 && <span className='text-green-500'>{c.unreadCount}</span>}
                                        <span className="text-xs text-gray-400">{displayTime}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                </div>
                {/* Chat */}
                <div className={`flex-1 relative flex`}>
                    {activeChat
                        ? <ChatDetail />
                        : <div className="m-auto hidden md:flex text-gray-500">{t('chat.select-chat')}</div>
                    }
                </div>
            </div>
            <Modal
                isOpen={isDeleteChatOpen}
                onClose={handleModalClose}
                title={t('modal.delete-chat.title')}
                size='sm'
            >
                <h2>{t('modal.delete-chat.subtitle')}</h2>
                <div className='flex justify-center items-center m-3 gap-4'>
                    <button
                        onClick={handleModalClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                    >
                        {t("modal.delete-account.cancel")}
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteChat(optionChatIdOpen)
                            handleModalClose()

                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        {t("modal.delete-account.accept")}
                    </button>
                </div>

            </Modal>
        </div >
    );
}
