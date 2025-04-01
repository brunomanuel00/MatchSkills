import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AspectRatio } from "../ui/aspect-ratio";
import { AvatarUploader } from "./AvatarUploader";
import { Modal } from "../Modal"; // Asegúrate de tener este componente

interface ProfileHeaderProps {
    avatarPreview: string | null;
    userAvatar: string | undefined;
    userName: string | undefined;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAvatar: () => void;
}

export const ProfileHeader = ({
    avatarPreview,
    userAvatar,
    userName,
    onAvatarChange,
    onRemoveAvatar,
}: ProfileHeaderProps) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <>
            <div className="flex justify-between px-6 py-4 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        {t('edit-profile.title')}
                    </h1>
                    <h2 className="text-sm md:text-lg text-gray-600 dark:text-gray-300">
                        {t('edit-profile.subtitle')}
                    </h2>
                </div>
                <div className="w-[50px]">
                    <AspectRatio
                        ratio={1 / 1}
                        className="bg-muted rounded-full cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img
                            src={avatarPreview || userAvatar}
                            alt={userName}
                            className="object-cover rounded-full w-full h-full"
                        />
                    </AspectRatio>
                </div>
            </div>

            {/* Modal para AvatarUploader */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('edit-profile.picture')}
            >
                <AvatarUploader
                    avatarPreview={avatarPreview}
                    userAvatar={userAvatar}
                    userName={userName}
                    onAvatarChange={onAvatarChange}
                    onRemoveAvatar={onRemoveAvatar}
                    t={t}
                />
            </Modal>
        </>
    );
};