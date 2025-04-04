import { Button } from "../ui/button";
import { Trash2, Upload } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

import { DEFAULT_AVATAR } from "../../types/profileTypes";
import { AvatarUploaderProps } from "../../types/profileTypes";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export const AvatarUploader = ({
    avatarPreview,
    userAvatar,
    userName,
    onAvatarChange,
    onRemoveAvatar,
    t
}: AvatarUploaderProps) => {
    return (
        <div className="flex flex-col justify-center  space-y-2">
            <div className="relative">
                <Avatar className="flex-shrink-1 h-10 w-10">
                    <AspectRatio ratio={1 / 1} >
                        <AvatarImage
                            src={avatarPreview || userAvatar}
                            alt={userName}
                            className="object-cover"
                        />
                    </AspectRatio>
                </Avatar>
            </div>

            <label>{!avatarPreview ? t('edit-profile.add-avatar') : t('edit-profile.change-avatar')}</label>
            <div className="flex flex-wrap items-center gap-4 py-2  rounded-lg border-verdigris-200 dark:border-verdigris-400">

                <p className="w-full text-s">
                    {t('edit-profile.recommend-size')}
                </p>

                <div className="flex-1 flex flex-col space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center bg-emerald-500 hover:bg-emerald-600  dark:bg-verdigris-600 dark:hover:bg-verdigris-500"
                            onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {t('edit-profile.upload')}
                        </Button>

                        {(avatarPreview || userAvatar !== DEFAULT_AVATAR.url) && (
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center bg-red-100 hover:bg-red-200 text-red-600 border-red-600 dark:bg-transparent dark:hover:bg-red-600"
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
                </div>
            </div>
        </div>
    );
};