import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Waypoints, User, LayoutDashboard, Bell, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';
import logo from '../assets/match de habilidades.jpg';
import { useTranslation } from "react-i18next";
import LogoutButton from './LogoutButton';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/theme-context';
import { useChat } from './context/ChatContext';
import { useLogOut } from './hooks/useLogOut';
import { useNotifications } from './hooks/useNotifications';

interface NavItem {
    translationKey: string;
    path: string;
    icon: React.ReactNode;
    name?: string;
    dropdown?: DropdownItem[];
}

interface DropdownItem {
    translationKey: string;
    path: string;
    icon: React.ReactNode;
    name?: string;
}

export const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
    const [teamMenuOpen, setTeamMenuOpen] = useState<boolean>(false);
    const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
    const [hasNotifications, setHasNotifications] = useState<boolean>(false);
    const location = useLocation();
    const { user } = useAuth();
    const { unReadTotal } = useChat();
    const { toggleTheme } = useTheme();
    const handleLogOut = useLogOut()
    const { recentNotifications, hasUnreadNotifications } = useNotifications();

    // Refs para manejar clicks fuera de los menús
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const teamMenuRef = useRef<HTMLDivElement>(null);
    const notificationsMenuRef = useRef<HTMLDivElement>(null);

    // Cerrar menús al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
            if (teamMenuRef.current && !teamMenuRef.current.contains(event.target as Node)) {
                setTeamMenuOpen(false);
            }
            if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const baseNavItems: NavItem[] = [
        {
            translationKey: 'logged.home',
            path: '/home',
            icon: <Home className="h-5 w-5" />
        },
        {
            translationKey: 'logged.matches',
            path: '/matches',
            icon: <Waypoints className="h-5 w-5" />
        },
        {
            translationKey: 'logged.messages',
            path: '/chat',
            icon: <MessageSquare className="h-5 w-5" />
        },
    ];

    const adminNavItem: NavItem = {
        translationKey: 'logged.dashboard',
        path: '/admin-dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />
    };

    const navItems: NavItem[] = user?.rol === 'admin'
        ? [...baseNavItems, adminNavItem]
        : baseNavItems;

    const getTranslatedNavItems = (): NavItem[] => {
        return navItems.map(item => ({
            ...item,
            name: t(item.translationKey),
            ...(item.dropdown && {
                dropdown: item.dropdown.map(dropItem => ({
                    ...dropItem,
                    name: t(dropItem.translationKey)
                }))
            })
        }));
    };

    const [translatedNavItems, setTranslatedNavItems] = useState<NavItem[]>(getTranslatedNavItems());

    useEffect(() => {
        setTranslatedNavItems(getTranslatedNavItems());
    }, [i18n.language]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    // Simular notificaciones
    useEffect(() => {
        (hasUnreadNotifications) ? setHasNotifications(true) : setHasNotifications(false)

    }, [hasUnreadNotifications]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-3xl">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/home" className="flex items-center gap-2">
                        <motion.img
                            src={logo}
                            alt="Match de Habilidades"
                            className="h-10 w-10 rounded-full"
                            whileHover={{ scale: 1.05 }}
                        />
                        <span className="font-bold text-lg md:block">{t('logged.title')}</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-4"> {/* Aumenté el gap */}
                        {translatedNavItems.map((item) => (
                            <div key={item.path} className="relative" ref={item.dropdown ? teamMenuRef : null}>
                                {item.dropdown ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setTeamMenuOpen(!teamMenuOpen);
                                                setProfileMenuOpen(false);
                                                setNotificationsOpen(false);
                                            }}
                                            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith(item.path)
                                                ? 'bg-tea_green-200 dark:bg-verdigris-600 text-gray-900 dark:text-white'
                                                : 'text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="mb-1">{item.icon}</div>
                                            <span className="text-xs">{item.name}</span>
                                        </button>

                                        {teamMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute left-0 mt-2 w-56 bg-white dark:bg-lapis_lazuli-500 rounded-md shadow-lg py-1 z-50"
                                            >
                                                {item.dropdown?.map((dropItem) => (
                                                    <Link
                                                        key={dropItem.path}
                                                        to={dropItem.path}
                                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={() => setTeamMenuOpen(false)}
                                                    >
                                                        {dropItem.icon}
                                                        <span>{dropItem.name}</span>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-tea_green-200 dark:bg-verdigris-600 text-gray-900 dark:text-white'
                                            : 'text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >

                                        <div className="mb-1">{item.icon}{item.path === '/chat' && unReadTotal !== 0 && (<div className='absolute z-50 top-1 right-5 h-2 w-2 bg-red-500 rounded-full'></div>)}</div>
                                        <span className="text-xs">{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            {/* Notificaciones */}
                            <div className="relative" ref={notificationsMenuRef}>
                                <button
                                    onClick={() => {
                                        setNotificationsOpen(!notificationsOpen);
                                        setProfileMenuOpen(false);
                                        setTeamMenuOpen(false);
                                    }}
                                    className="p-2 rounded-lg text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                                >
                                    <motion.div
                                        animate={hasNotifications ? {
                                            rotate: [0, -15, 15, -15, 15, 0],
                                            transition: {
                                                duration: 0.5,
                                                repeat: 2
                                            }
                                        } : {}}
                                    >
                                        <Bell className="h-5 w-5" />
                                    </motion.div>
                                    <AnimatePresence>
                                        {hasNotifications && (
                                            <motion.span
                                                className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </button>

                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-lapis_lazuli-500 rounded-md shadow-lg py-1 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-400">
                                            <h3 className="font-medium text-gray-900 dark:text-white">{t('logged.notifications')}</h3>
                                        </div>
                                        {recentNotifications.length === 0 ?
                                            <div className='flex flex-col p-3 items-center justify-center'>
                                                <h3 className='font-semibold'>{t('notifications.empty.title')}</h3>
                                            </div>
                                            : recentNotifications.map(item => (
                                                <div>
                                                    <div className="max-h-60 overflow-y-auto">
                                                        <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-lapis_lazuli-300 cursor-pointer">
                                                            <div className="flex items-start">
                                                                <div className="ml-3 flex-1">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {item?.data?.message}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {t('logged.user_wants_to_join')}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
                                                                        {t('logged.hours_ago', { count: 2 })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}

                                        <Link
                                            to="/notifications"
                                            className="block px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-lapis_lazuli-300 border-t border-gray-200 dark:border-gray-400"
                                            onClick={() => setNotificationsOpen(false)}
                                        >
                                            {t('logged.view-all')}
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                            <LanguageToggle />
                            {/* Menú desplegable del perfil */}
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => {
                                        setProfileMenuOpen(!profileMenuOpen);
                                        setTeamMenuOpen(false);
                                        setNotificationsOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <User className="h-5 w-5" />
                                </button>


                                {profileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-lapis_lazuli-500 rounded-md shadow-lg py-1 z-50"
                                    >
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            <span>{t('logged.profile')}</span>
                                        </Link>
                                        <div onClick={toggleTheme} className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                            <span>{t('theme.toggle')}</span>
                                            <div className="ml-auto">
                                                <ThemeToggle />
                                            </div>
                                        </div>
                                        <div onClick={handleLogOut} className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                            <span>{t('session.close')}</span>
                                            <div className="ml-auto">
                                                <LogoutButton />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <button
                            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            <AnimatePresence>
                                {hasNotifications && !mobileMenuOpen && (
                                    <motion.span
                                        className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                    />
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed inset-0 z-40 md:hidden bg-white dark:bg-lapis_lazuli-400 pt-20 px-4"
                >
                    <div className="flex flex-col h-full">
                        <nav className="flex flex-col gap-2">
                            {translatedNavItems.map((item) => (
                                <div key={item.path}>
                                    <Link
                                        onClick={() => setMobileMenuOpen(false)}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-tea_green-200 dark:bg-verdigris-600 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </Link>

                                    {item.dropdown && (
                                        <div className="ml-4">
                                            {item.dropdown.map((dropItem) => (
                                                <Link
                                                    key={dropItem.path}
                                                    to={dropItem.path}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === dropItem.path
                                                        ? 'bg-tea_green-200 dark:bg-verdigris-600 text-gray-900 dark:text-white'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {dropItem.icon}
                                                    <span>{dropItem.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Sección de notificaciones en móvil */}
                            <div className="mt-4">
                                <h3 className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">{t('logged.notifications')}</h3>
                                <Link
                                    to="/notifications"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className=" relative flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span>{t('logged.view-all')}</span>
                                    <AnimatePresence>
                                        {hasNotifications && (
                                            <motion.span
                                                className="absolute top-1 left-28 h-2 w-2 rounded-full bg-red-500"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                </Link>
                            </div>

                            {/* Sección de perfil en móvil */}
                            <div className="mt-4">
                                <h3 className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">{t('logged.profile')}</h3>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <User className="h-5 w-5" />
                                    <span>{t('logged.profile')}</span>
                                </Link>
                            </div>
                        </nav>

                        <div className="mt-auto mb-8 flex flex-col gap-4">
                            <div className="flex justify-center gap-6 py-4">
                                <ThemeToggle />
                                <LanguageToggle />
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
};