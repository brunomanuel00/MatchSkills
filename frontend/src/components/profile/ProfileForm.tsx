import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { AvatarUploader } from "./AvatarUploader";

interface ProfileFormProps {
    userEdit: any;
    setUserEdit: (user: any) => void;
    avatarPreview: string | null;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAvatar: () => void;
}

export const ProfileForm = ({
    userEdit,
    setUserEdit,
    avatarPreview,
    onAvatarChange,
    onRemoveAvatar
}: ProfileFormProps) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="name" className="text-lapis_lazuli-600 dark:text-tea_green-200">
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={userEdit?.name}
                        onChange={(e) => setUserEdit({ ...userEdit!, name: e.target.value })}
                        className="bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="email" className="text-lapis_lazuli-600 dark:text-tea_green-200">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={userEdit?.email}
                        onChange={(e) => setUserEdit({ ...userEdit!, email: e.target.value })}
                        className="bg-white/70 dark:bg-lapis_lazuli-300/70 border-verdigris-200 dark:border-verdigris-400"
                    />
                </div>
            </div>

            <AvatarUploader
                avatarPreview={avatarPreview}
                userAvatar={userEdit?.avatar.url}
                userName={userEdit?.name}
                onAvatarChange={onAvatarChange}
                onRemoveAvatar={onRemoveAvatar}
            />
        </div>
    );
};