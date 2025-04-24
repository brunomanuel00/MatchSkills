import { Tabs, TabsContent } from "../ui/tabs";
import { CardContent } from "../ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileForm } from "./ProfileForm";
import { SkillsTab } from "./SkillsTab";
import { ProfileFooter } from "./ProfileFooter";
import { TAB_VALUES } from "../../types/profileTypes";
import { useProfileForm } from "../hooks/useProfileForm";
import { ProfileEditorProps } from "../../types/profileTypes";
import DeleteAccount from "../DeleteAccount";

export function ProfileEditor({ user, onClose, isModal }: ProfileEditorProps) {
    const {
        userEdit,
        setUserEdit,
        skills,
        hasChanges,
        isSubmitting,
        avatarPreview,
        activeTab,
        setActiveTab,
        passwords,
        setPasswords,
        passwordError,
        handleSkillsChange,
        handleAvatarChange,
        removeAvatar,
        handleSubmit,
        handleCancel,
        t
    } = useProfileForm({ externalUser: user, onClose });

    return (
        <div className={isModal ? "p-4" : "min-h-screen flex justify-center items-center bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700"}>
            <div className={isModal ? "p-4" : "min-w-full px-4 py-6 mt-20 md:px- md:py-8"}>
                <div className="bg-white dark:bg-lapis_lazuli-300 rounded-lg shadow-lg overflow-hidden">
                    <ProfileHeader
                        avatarPreview={avatarPreview}
                        userAvatar={userEdit.avatar.url}
                        userName={userEdit.name}
                        onAvatarChange={handleAvatarChange}
                        onRemoveAvatar={removeAvatar}
                    />

                    <form onSubmit={handleSubmit} className="flex flex-col h-full p-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <ProfileTabs t={t} onTabChange={setActiveTab} />

                            <div className="flex-1 overflow-auto">
                                <TabsContent value={TAB_VALUES.PROFILE} className="h-full">
                                    <CardContent className="p-1 space-y-6">
                                        <ProfileForm
                                            userEdit={userEdit}
                                            setUserEdit={setUserEdit}
                                            t={t}
                                            passwords={passwords}
                                            onPasswordChange={(field, value) =>
                                                setPasswords(prev => ({ ...prev, [field]: value }))
                                            }
                                            passwordError={passwordError}
                                        />
                                    </CardContent>
                                </TabsContent>

                                <TabsContent value={TAB_VALUES.SKILLS} className="h-full">
                                    <CardContent className="p-0 pb-4">
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
                                t={t}
                            />
                            <div className="w-full h-0.5 mt-4 bg-gray-400 dark:bg-verdigris-500 "></div>
                            <div className="pt-5">
                                <TabsContent value={TAB_VALUES.PROFILE} className="h-full">
                                    <h2 className="text-red-600 dark:text-red-500 font-semibold text-2xl mx-6">{t('edit-profile.delete-account')}</h2>
                                    <CardContent className="flex flex-col justify-between ">
                                        <p className="my-3">
                                            {t("edit-profile.delete-description")}
                                        </p>
                                        <DeleteAccount t={t} id={userEdit.id} showText={true} />
                                    </CardContent>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </form>
                </div>
            </div>
        </div>
    );
}
