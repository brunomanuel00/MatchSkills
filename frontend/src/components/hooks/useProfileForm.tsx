import { useMemo, useState, useEffect, useCallback } from "react";
import { isEqual } from "lodash";
import { toastEasy } from "./toastEasy";
import { DEFAULT_AVATAR, TAB_VALUES } from "../../types/profileTypes";
import userService from "../../services/userService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { SelectedSkills } from "../../types/skillTypes";

export function useProfileForm() {
    const { user, updateUser } = useAuth();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Memorizar estado inicial y datos costosos
    const initialUserState = useMemo(() => ({
        ...user,
        avatar: user?.avatar || DEFAULT_AVATAR,
        skills: user?.skills ? [...user.skills] : [],
        lookingFor: user?.lookingFor ? [...user.lookingFor] : []
    }), [user]);

    const initialSkillsState = useMemo(() => ({
        mySkills: user?.skills ? [...user.skills] : [],
        desiredSkills: user?.lookingFor ? [...user.lookingFor] : []
    }), [user?.skills, user?.lookingFor]);

    // 2. Estados
    const [userEdit, setUserEdit] = useState(initialUserState);
    const [skills, setSkills] = useState(initialSkillsState);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const initialTab = searchParams.get("tab") ?? TAB_VALUES.PROFILE;
    const [activeTab, setActiveTab] = useState(initialTab);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    // 3. Efectos

    // Detectar cambios (comparación profunda)
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
    }, [userEdit, initialUserState, avatarFile, avatarPreview, passwords.newPassword, initialSkillsState]);

    // Actualizar parámetro de búsqueda (tab)
    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    // Validar contraseñas
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
    }, [passwords.newPassword, passwords.confirmPassword, t]);

    // 4. Handlers

    const handleSkillsChange = useCallback((newSkills: SelectedSkills) => {
        setUserEdit(prev => ({
            ...prev!,
            skills: newSkills?.mySkills ?? [],
            lookingFor: newSkills?.desiredSkills ?? []
        }));
        setSkills(newSkills);
    }, []);

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toastEasy("error", t("errorMessage.invalidFormateIMG"));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toastEasy("error", t("errorMessage.oversized"));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
        setAvatarFile(file);
    }, [t]);

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

        if (passwords.newPassword && passwords.newPassword.length < 8) {
            return toastEasy('error', t("validation.passwordLength"));
        }
        if (!userEdit?.id || typeof userEdit.id !== 'string') {
            throw new Error(t("errorMessage.idInvalid"));
        }

        setIsSubmitting(true);
        try {
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

            setPasswords({ newPassword: '', confirmPassword: '' });
            setAvatarFile(null);
            setAvatarPreview(null);
            setHasChanges(false);
        } catch (error) {
            console.error('Error en handleSubmit:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : t("errorMessage.updateUser");
            toastEasy('error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [userEdit, initialUserState, passwords, avatarFile, avatarPreview, t, updateUser]);

    const handleCancel = useCallback(() => {
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
            initialUserState.avatar.url === DEFAULT_AVATAR.url ? null : initialUserState.avatar.url
        );
        setPasswords({ newPassword: '', confirmPassword: '' });
        setPasswordError('');
        setHasChanges(false);
    }, [initialUserState]);

    return {
        userEdit,
        setUserEdit,
        skills,
        hasChanges,
        isSubmitting,
        avatarFile,
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
    };
}
