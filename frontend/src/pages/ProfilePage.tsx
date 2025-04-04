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
import { toastEasy } from "../components/hooks/toastEasy";
import userService from "../services/userService";

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const { t } = useTranslation();

    // 1. Memorizar estado inicial y datos costosos
    const initialUserState = useMemo(() => ({
        ...user,
        avatar: user?.avatar || DEFAULT_AVATAR,
        skills: user?.skills ? [...user.skills] : [], // Copia profunda
        lookingFor: user?.lookingFor ? [...user.lookingFor] : [] // Copia profunda
    }), [user]);

    const initialSkillsState = useMemo(() => ({
        mySkills: user?.skills ? [...user.skills] : [], // Copia profunda
        desiredSkills: user?.lookingFor ? [...user.lookingFor] : [] // Copia profunda
    }), [user?.skills, user?.lookingFor]);

    // 2. Estados
    const [userEdit, setUserEdit] = useState(initialUserState);
    const [skills, setSkills] = useState(initialSkillsState)
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(TAB_VALUES.PROFILE);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    // 3. Detectar cambios (comparación profunda)
    useEffect(() => {
        const basicChanges = !isEqual(
            { name: userEdit?.name, email: userEdit?.email },
            { name: initialUserState?.name, email: initialUserState?.email }
        );

        const skillsChanged = !isEqual(
            {
                skills: userEdit?.skills,
                lookingFor: userEdit?.lookingFor
            },
            {
                skills: initialSkillsState?.mySkills,
                lookingFor: initialSkillsState?.desiredSkills
            }
        );

        const avatarChanged = avatarFile !== null ||
            (avatarPreview === null && userEdit?.avatar.url !== initialUserState?.avatar.url);

        const passwordChanged = passwords.newPassword.length > 0;

        setHasChanges(basicChanges || skillsChanged || avatarChanged || passwordChanged);
    }, [userEdit, initialUserState, avatarFile, avatarPreview, passwords.newPassword]);

    useEffect(() => {
        if (passwords.newPassword && passwords.confirmPassword) {
            if (passwords.newPassword !== passwords.confirmPassword) {
                setPasswordError(t("validation.passwordMatch"));

            } else if (passwords.newPassword.length < 8) {
                setPasswordError(t("validation.passwordLength"));

            } else {
                setPasswordError('');

            }
        } else {
            setPasswordError('');


        }
    }, [passwords.newPassword, passwords.confirmPassword]);

    // 4. Handlers memorizados
    const handleSkillsChange = useCallback((skills: SelectedSkills) => {
        setUserEdit(prev => ({
            ...prev!,
            skills: skills?.mySkills ?? [],
            lookingFor: skills?.desiredSkills ?? []
        }));
        setSkills(skills)
    }, []);

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toastEasy("error", t("errorMessage.invalidFormateIMG"))
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toastEasy("error", t("errorMessage.oversized"))
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
        setAvatarFile(file);

    }, []);

    const removeAvatar = useCallback(() => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setUserEdit(prev => ({
            ...prev!,
            avatar: DEFAULT_AVATAR
        }));
        setHasChanges(true);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones de contraseña
        if (passwords.newPassword && passwords.newPassword.length < 8) {
            return toastEasy('error', t("validation.passwordLength"));
        }
        if (!userEdit?.id || typeof userEdit.id !== 'string') {
            throw new Error(t("errorMessage.idInvalid"));
        }

        setIsSubmitting(true);
        try {
            // Verificar que tenemos un ID válido
            if (!userEdit?.id) {
                throw new Error('ID de usuario no válido');
            }

            console.log('ID que se enviará:', userEdit.id); // Debug

            // Preparar datos para actualización
            const updatePayload = {
                name: userEdit?.name !== initialUserState?.name ? userEdit?.name : undefined,
                email: userEdit?.email !== initialUserState?.email ? userEdit?.email : undefined,
                skills: !isEqual(userEdit?.skills, initialUserState?.skills) ? userEdit?.skills : undefined,
                lookingFor: !isEqual(userEdit?.lookingFor, initialUserState?.lookingFor) ? userEdit?.lookingFor : undefined,
                password: passwords.newPassword || undefined,
                avatar: avatarFile || (avatarPreview === null ? '' : undefined)
            };



            const updatedUserData = await userService.updateUser(userEdit.id, updatePayload);

            updateUser(updatedUserData);

            toastEasy('success');

            // Resetear estados
            setPasswords({ newPassword: '', confirmPassword: '' });
            setAvatarFile(null);
            setAvatarPreview(null);
            setHasChanges(false);


        } catch (error) {
            console.error('Error en handleSubmit:', error); // Debug
            const errorMessage = error instanceof Error
                ? error.message
                : t("errorMessage.updateUser");
            toastEasy('error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [userEdit, initialUserState, passwords, avatarFile, avatarPreview]);


    const handleCancel = useCallback(() => {
        // Resetear todos los estados a sus valores iniciales
        setUserEdit({
            ...initialUserState,
            skills: [...initialUserState.skills],
            lookingFor: [...initialUserState.lookingFor]
        });

        setSkills({
            mySkills: [...initialUserState.skills],
            desiredSkills: [...initialUserState.lookingFor]
        });

        setAvatarFile(null);
        setAvatarPreview(
            initialUserState.avatar.url === DEFAULT_AVATAR.url
                ? null
                : initialUserState.avatar.url
        );
        setPasswords({ newPassword: '', confirmPassword: '' });
        setPasswordError('');
        setHasChanges(false);
    }, [initialUserState]);

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
                                            passwords={passwords}
                                            onPasswordChange={(field, value) =>
                                                setPasswords(prev => ({ ...prev, [field]: value }))
                                            }
                                            passwordError={passwordError}
                                        />
                                    </CardContent>
                                </TabsContent>

                                <TabsContent value={TAB_VALUES.SKILLS} className="h-full">
                                    <CardContent className="p-6">
                                        <SkillsTab
                                            key={`skills-${JSON.stringify(initialSkillsState)}`}
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
                        </Tabs>
                    </form>
                </div>
            </div>
        </div>
    );
}