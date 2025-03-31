import { Button } from "../ui/button";
import { Trash2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { DEFAULT_AVATAR } from "../../types/profileTypes";

interface AvatarUploaderProps {
    avatarPreview: string | null;
    userAvatar: string | undefined;
    userName: string | undefined;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAvatar: () => void;
}

export const AvatarUploader = ({
    avatarPreview,
    userAvatar,
    userName,
    onAvatarChange,
    onRemoveAvatar
}: AvatarUploaderProps) => {
    return (
        <div className="flex flex-col space-y-2">
            <label className="text-lapis_lazuli-600 dark:text-tea_green-200">Profile Picture</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed rounded-lg border-verdigris-200 dark:border-verdigris-400">
                <Avatar className="flex-shrink-0 h-24 w-24 border-2 border-emerald-400">
                    <AvatarImage
                        src={avatarPreview || userAvatar}
                        alt={userName}
                        className="object-cover"
                    />
                    <AvatarFallback className="flex items-center justify-center bg-verdigris-300 text-white">
                        <User className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex flex-col space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center bg-tea_green-100 hover:bg-tea_green-200 text-lapis_lazuli-600 border-verdigris-300 dark:bg-lapis_lazuli-300 dark:text-tea_green-100 dark:hover:bg-lapis_lazuli-200"
                            onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New Image
                        </Button>

                        {(avatarPreview || userAvatar !== DEFAULT_AVATAR.url) && (
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center bg-red-100 hover:bg-red-200 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                onClick={onRemoveAvatar}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        )}
                    </div>

                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onAvatarChange}
                    />

                    <p className="text-sm text-lapis_lazuli-400 dark:text-tea_green-100/70">
                        Recommended: Square image, at least 300x300px
                    </p>
                </div>
            </div>
        </div>
    );
};