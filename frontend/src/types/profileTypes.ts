import { TFunction } from "i18next";

export const TAB_VALUES = {
    PROFILE: "profile",
    SKILLS: "skills"
};

export const DEFAULT_AVATAR = {
    public_id: "default_avatar",
    url: "https://res.cloudinary.com/decnbbgn8/image/upload/v1743115286/default_avatars.svg_lszftj.png"
};

export interface ProfileFormProps {
    userEdit: any;
    setUserEdit: (user: any) => void;
    t: (key: string) => string;
    passwords: {
        newPassword: string;
        confirmPassword: string;
    };
    onPasswordChange: (field: 'newPassword' | 'confirmPassword', value: string) => void;
    passwordError?: string;
}
export interface ProfileTabsProps {
    onTabChange: (value: string) => void;
    t: TFunction<"translation", undefined>;

}

export interface AvatarUploaderProps {
    avatarPreview: string | null;
    userAvatar: string | undefined;
    userName: string | undefined;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAvatar: () => void;
    t: TFunction<"translation", undefined>;
}