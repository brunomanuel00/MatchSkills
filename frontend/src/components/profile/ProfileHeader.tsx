import { useTranslation } from "react-i18next";

export const ProfileHeader = () => {
    const { t } = useTranslation();

    return (
        <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
                {t('edit-profile.title')}
            </h1>
            <h2 className="text-sm md:text-lg text-gray-600 dark:text-gray-300">
                {t('edit-profile.subtitle')}
            </h2>
        </div>
    );
};