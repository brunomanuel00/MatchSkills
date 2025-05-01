import { Link } from 'react-router-dom';
import { Home, Waypoints, User, Github, Linkedin, LayoutDashboard } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export const Footer = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    const baseFooterItems = [
        { translationKey: 'footer.home', path: '/home', icon: <Home className="h-5 w-5" /> },
        { translationKey: 'footer.matches', path: '/matches', icon: <Waypoints className="h-5 w-5" /> },
        { translationKey: 'footer.profile', path: '/profile', icon: <User className="h-5 w-5" /> },
    ];

    const adminFooterItem = {
        translationKey: 'footer.dashboard',
        path: '/admin-dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />
    };

    const footerItems = user?.rol === 'admin'
        ? [...baseFooterItems, adminFooterItem]
        : baseFooterItems;


    const getTranslatedFooterItems = () => {
        return footerItems.map(item => ({
            ...item,
            name: t(item.translationKey)
        }));
    };


    const [translatedFooterItems, setTranslatedFooterItems] = useState(getTranslatedFooterItems());

    const socialLinks = [
        { name: 'GitHub', url: 'https://github.com/brunomanuel00', icon: <Github className="h-6 w-6" /> },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/bruno-coello', icon: <Linkedin className="h-6 w-6" /> },
    ];

    useEffect(() => {
        setTranslatedFooterItems(getTranslatedFooterItems());
    }, [i18n.language]);

    return (
        <footer className="bg-white dark:bg-lapis_lazuli-400 border-t border-gray-200 dark:border-white mt-auto">
            <div className=" mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 px-5 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">{t('footer.title')}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2">
                            {translatedFooterItems.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-tea_green-400 dark:hover:text-verdigris-400 transition-colors"
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t('footer.connect')}</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-300 hover:text-tea_green-400 dark:hover:text-verdigris-400 transition-colors"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                            <div className="flex items-start justify-start">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white my-6 px-0" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm px-5 text-gray-500 dark:text-white">
                    <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
                    {user && (
                        <p className="mt-2 md:mt-0">
                            {t('footer.loggedInAs')}: <span className="font-medium">{user.email}</span>
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
};