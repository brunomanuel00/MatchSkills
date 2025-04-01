import { useMemo, useState, useEffect, useCallback } from "react";
import { useAuth } from "../components/context/AuthContext";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { CardContent } from "../components/ui/card";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileTabs } from "../components/profile/ProfileTabs";
import { ProfileForm } from "../components/profile/ProfileForm";
import { SkillsTab } from "../components/profile/SkillsTab";
import { ProfileFooter } from "../components/profile/ProfileFooter";
import { SelectedSkills } from "../types/skillTypes";
import { TAB_VALUES, DEFAULT_AVATAR } from '../types/profileTypes';
import { useTranslation } from "react-i18next";
import { isEqual } from "lodash";

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useTranslation();

    // 1. Memorizar estado inicial y datos costosos
    const initialUserState = useMemo(() => user, []);
    const skills = useMemo(() => ({
        mySkills: user?.skills ?? [],
        desiredSkills: user?.lookingFor ?? []
    }), [user?.skills, user?.lookingFor]);

    // 2. Estados
    const [userEdit, setUserEdit] = useState(initialUserState);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(TAB_VALUES.PROFILE);

    // 3. Detectar cambios (comparación profunda)
    useEffect(() => {
        const userChanged = !isEqual(userEdit, initialUserState);
        const avatarChanged = avatarPreview !== null || avatarFile !== null;
        setHasChanges(userChanged || avatarChanged);
    }, [userEdit, initialUserState, avatarPreview, avatarFile]);

    // 4. Handlers memorizados
    const handleSkillsChange = useCallback((skills: SelectedSkills) => {
        setUserEdit(prev => ({
            ...prev!,
            skills: skills?.mySkills ?? [],
            lookingFor: skills?.desiredSkills ?? []
        }));
    }, []);

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

    const removeAvatar = useCallback(() => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setUserEdit(prev => ({
            ...prev!,
            avatar: DEFAULT_AVATAR
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasChanges) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Datos guardados:", { userEdit, avatarFile });
            // Aquí iría tu llamada real al backend
        } finally {
            setIsSubmitting(false);
        }
    }, [hasChanges, userEdit, avatarFile]);

    const handleCancel = useCallback(() => {
        setUserEdit(initialUserState);
        setAvatarFile(null);
        setAvatarPreview(null);
    }, [initialUserState]);

    // 5. Render optimizado
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
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="flex-1 flex flex-col"
                        >
                            <ProfileTabs
                                t={t}
                                onTabChange={setActiveTab}
                            />

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
                                        <SkillsTab
                                            skills={skills}
                                            onSkillsChange={handleSkillsChange}
                                        />
                                    </CardContent>
                                </TabsContent>
                            </div>

                            <ProfileFooter
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSaveDisabled={!hasChanges || isSubmitting}
                            />
                        </Tabs>
                    </form>
                </div>
            </div>
        </div>
    );
}