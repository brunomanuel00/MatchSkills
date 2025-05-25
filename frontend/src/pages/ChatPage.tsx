import { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import ChatDetail from '../components/ChatDetails';
import { useChat } from '../components/context/ChatContext';
import { useTranslation } from 'react-i18next';
import { es, enUS } from 'date-fns/locale';



export default function ChatPage() {
    const { chats, setActiveChat, activeChat, loadChats } = useChat()
    const [selected] = useState<string | null>(null);
    const { t, i18n } = useTranslation()

    useEffect(() => {
        loadChats()
    }, [])

    const currentLocale = i18n.language === 'es' ? es : enUS;

    return (
        <div className=" min-h-screen pt-14 items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">

            <div className="flex min-h-[650px] max-h-[800px] rounded-md mt-10 bg-white dark:bg-cyan-950">

                {/* Lista */}
                <div className={`border-r dark:border-r-teal-800 md:w-1/3 ${selected ? 'hidden md:block' : 'block'} overflow-auto`}>
                    <h2 className="p-4 text-lg font-bold">{t('chat.chats')}</h2>
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
                                    className="p-4 hover:bg-gray-100 dark:hover:bg-cyan-800 cursor-pointer flex items-center"
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
                                    <div className='flex flex-col items-end'>
                                        {c.unreadCount !== 0 && <span className='text-green-500'>{c.unreadCount}</span>}
                                        <span className="text-xs text-gray-400">{displayTime}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                </div>
                {/* Conversación */}
                <div className={`flex-1 relative ${!selected ? 'hidden md:flex' : 'flex'}`}>
                    {activeChat
                        ? <ChatDetail />
                        : <div className="m-auto text-gray-500">{t('chat.select-chat')}</div>
                    }
                </div>
            </div>
        </div >
    );
}
