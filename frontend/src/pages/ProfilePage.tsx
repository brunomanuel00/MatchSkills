import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { CardContent } from "../components/ui/card";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileTabs } from "../components/profile/ProfileTabs";
import { ProfileForm } from "../components/profile/ProfileForm";
import { SkillsTab } from "../components/profile/SkillsTab";
import { ProfileFooter } from "../components/profile/ProfileFooter";
import { SelectedSkills } from "../types/skillTypes";
import { TAB_VALUES, DEFAULT_AVATAR } from '../types/profileTypes'
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useTranslation()
    const [userEdit, setUserEdit] = useState(user);
    const [activeTab, setActiveTab] = useState(TAB_VALUES.PROFILE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const skills: SelectedSkills = {
        mySkills: user?.skills ?? [],
        desiredSkills: user?.lookingFor ?? []
    };

    const handleSkillsChange = (skills: SelectedSkills) => {
        setUserEdit(prev => ({
            ...prev!,
            skills: skills?.mySkills ?? [],
            lookingFor: skills?.desiredSkills ?? []
        }))
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Saving user profile:", userEdit);
            console.log("New avatar file:", avatarFile);
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setUserEdit(prev => ({
            ...prev!,
            avatar: DEFAULT_AVATAR
        }));
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
            <div className="min-w-full px-4 p-6 mt-20 md:px- md:py-8">
                <div className="bg-white dark:bg-lapis_lazuli-300 rounded-lg shadow-lg overflow-hidden">
                    <ProfileHeader
                        avatarPreview={avatarPreview}
                        userAvatar={userEdit?.avatar.url as string | undefined}
                        userName={userEdit?.name}
                        onAvatarChange={handleAvatarChange}
                        onRemoveAvatar={removeAvatar}
                    />

                    <form onSubmit={handleSubmit} className="flex flex-col h-full p-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <ProfileTabs t={t} onTabChange={setActiveTab} />

                            <div className="flex-1 overflow-auto">
                                <TabsContent value={TAB_VALUES.PROFILE} className="h-full">
                                    <CardContent className="p-6 space-y-6">
                                        <ProfileForm
                                            userEdit={userEdit}
                                            setUserEdit={setUserEdit}
                                            t={t}
                                        />
                                    </CardContent>
                                </TabsContent>

                                <TabsContent value={TAB_VALUES.SKILLS} className="h-full">
                                    <CardContent className="p-6">
                                        <SkillsTab skills={skills} onSkillsChange={handleSkillsChange} />
                                    </CardContent>
                                </TabsContent>
                            </div>

                            <ProfileFooter
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                                onCancel={() => console.log("Cancel clicked")}
                            />
                        </Tabs>
                    </form>
                </div>
            </div>
        </div>
    );
}