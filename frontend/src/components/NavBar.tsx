import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Waypoints, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';
import logo from '../assets/match de habilidades.jpg';
import { useTranslation } from "react-i18next"
import LogoutButton from './LogoutButton';
import { useAuth } from './context/AuthContext';

export const Navbar = () => {
    const { t, i18n } = useTranslation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth()


    const baseNavItems = [
        { translationKey: 'logged.home', path: '/home', icon: <Home className="h-5 w-5" /> },
        { translationKey: 'logged.matches', path: '/matches', icon: <Waypoints className="h-5 w-5" /> },
        { translationKey: 'logged.profile', path: '/profile', icon: <User className="h-5 w-5" /> },
    ];

    const adminNavItem = {
        translationKey: 'logged.dashboard',
        path: '/admin-dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />
    };

    const navItems = user?.rol === 'admin'
        ? [...baseNavItems, adminNavItem]  // Admin: todos los ítems
        : baseNavItems;


    const getTranslatedNavItems = () => {
        return navItems.map(item => ({
            ...item,
            name: t(item.translationKey)
        }));
    };


    const [translatedNavItems, setTranslatedNavItems] = useState(getTranslatedNavItems());

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


    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md ">
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

                    <nav className="hidden md:flex items-center gap-2">
                        {translatedNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-tea_green-200 dark:bg-verdigris-600 text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            <ThemeToggle />
                            <LanguageToggle />
                            <LogoutButton />
                        </div>
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                                <Link
                                    onClick={() => setMobileMenuOpen(false)}
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                        ? 'bg-tea_green-200 dark:bg-verdigris-600 text-gray-900 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
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