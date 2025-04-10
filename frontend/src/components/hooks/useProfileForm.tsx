// hooks/useProfileForm.ts
import { useMemo, useState, useEffect, useCallback } from "react";
import { isEqual } from "lodash";
import { toastEasy } from "../hooks/toastEasy";
import { DEFAULT_AVATAR, TAB_VALUES } from "../../types/profileTypes";
import userService from "../../services/userService";
import { useAuth } from "../../components/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { SelectedSkills } from "../../types/skillTypes";
import { UseProfileFormOptions } from "../../types/profileTypes";
import authService from "../../services/authService";

export function useProfileForm({ externalUser, onClose }: UseProfileFormOptions = {}) {
    const { user: authUser, updateUser } = useAuth();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    // El usuario a editar: si externalUser existe, lo usamos; si no, el del contexto
    const baseUser = externalUser ?? authUser;
    if (!baseUser) throw new Error("No hay usuario para editar");

    // 1. Estados iniciales memoizados
    const initialUserState = useMemo(() => ({
        ...baseUser,
        avatar: baseUser.avatar || DEFAULT_AVATAR,
        skills: baseUser.skills ? [...baseUser.skills] : [],
        lookingFor: baseUser.lookingFor ? [...baseUser.lookingFor] : []
    }), [baseUser]);

    const initialSkillsState = useMemo(() => ({
        mySkills: baseUser.skills ? [...baseUser.skills] : [],
        desiredSkills: baseUser.lookingFor ? [...baseUser.lookingFor] : []
    }), [baseUser.skills, baseUser.lookingFor]);

    // 2. Estados
    const [userEdit, setUserEdit] = useState(initialUserState);
    const [skills, setSkills] = useState(initialSkillsState);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const initialTab = searchParams.get("tab") ?? TAB_VALUES.PROFILE;
    const [activeTab, setActiveTab] = useState(initialTab);
    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [passwordError, setPasswordError] = useState("");

    // 3. Efectos

    // Detectar cambios
    useEffect(() => {
        const basicChanges = !isEqual(
            { name: userEdit.name, email: userEdit.email, rol: userEdit.rol },
            { name: initialUserState.name, email: initialUserState.email, rol: initialUserState.rol },
        );

        const skillsChanged = !isEqual(
            { skills: userEdit.skills, lookingFor: userEdit.lookingFor },
            { skills: initialSkillsState.mySkills, lookingFor: initialSkillsState.desiredSkills }
        );
        const avatarChanged = avatarFile !== null ||
            (avatarPreview === null && userEdit.avatar.url !== initialUserState.avatar.url);
        const passwordChanged = passwords.newPassword.length > 0;

        setHasChanges(basicChanges || skillsChanged || avatarChanged || passwordChanged);
    }, [
        userEdit, initialUserState, initialSkillsState,
        avatarFile, avatarPreview, passwords.newPassword, initialSkillsState.mySkills,
        initialSkillsState.desiredSkills
    ]);

    // Sincronizar query param `tab`
    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    // Validar passwords
    useEffect(() => {
        if (passwords.newPassword && passwords.confirmPassword) {
            if (passwords.newPassword !== passwords.confirmPassword) {
                setPasswordError(t("validation.passwordMatch"));
            } else if (passwords.newPassword.length < 8) {
                setPasswordError(t("validation.passwordLength"));
            } else {
                setPasswordError("");
            }
        } else {
            setPasswordError("");
        }
    }, [passwords.newPassword, passwords.confirmPassword, t]);

    // 4. Handlers

    const handleSkillsChange = useCallback((newSkills: SelectedSkills) => {
        setUserEdit(prev => ({
            ...prev!,
            skills: newSkills.mySkills,
            lookingFor: newSkills.desiredSkills
        }));
        setSkills(newSkills);
    }, []);

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
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
        setUserEdit(prev => ({ ...prev!, avatar: DEFAULT_AVATAR }));
        setHasChanges(true);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword && passwords.newPassword.length < 8) {
            return toastEasy("error", t("validation.passwordLength"));
        }
        if (!userEdit.id) {
            throw new Error(t("errorMessage.idInvalid"));
        }
        setIsSubmitting(true);
        try {
            const payload: any = {
                name: userEdit.name !== initialUserState.name ? userEdit.name : undefined,
                email: userEdit.email !== initialUserState.email ? userEdit.email : undefined,
                skills: !isEqual(userEdit.skills, initialUserState.skills) ? userEdit.skills : undefined,
                lookingFor: !isEqual(userEdit.lookingFor, initialUserState.lookingFor) ? userEdit.lookingFor : undefined,
                password: passwords.newPassword || undefined,
                avatar: avatarFile || (avatarPreview === null ? "" : undefined)
            };
            const updated = await userService.updateUser(userEdit.id, payload);
            // Si es usuario propio, actualizamos el contexto
            if (!externalUser) updateUser(updated);
            toastEasy("success");
            // reset
            const newInitialState = {
                ...updated,
                avatar: updated.avatar || DEFAULT_AVATAR,
                skills: updated.skills ? [...updated.skills] : [],
                lookingFor: updated.lookingFor ? [...updated.lookingFor] : [],
            };
            setUserEdit(newInitialState);
            setPasswords({ newPassword: "", confirmPassword: "" });
            setAvatarFile(null);
            setAvatarPreview(null);
            setHasChanges(false);
            // si hay onClose, lo llamamos (para modal)
            onClose?.();

        } catch (err: any) {
            console.error(err);
            toastEasy("error", err.message || t("errorMessage.updateUser"));
        } finally {
            setIsSubmitting(false);

        }
    }, [
        userEdit, initialUserState, passwords,
        avatarFile, avatarPreview, externalUser, updateUser, t
    ]);

    const handleCancel = useCallback(() => {
        if (externalUser) {
            onClose?.();
        } else {
            setUserEdit({ ...initialUserState, skills: [...initialUserState.skills], lookingFor: [...initialUserState.lookingFor], avatar: { ...initialUserState.avatar } });
            setSkills({ mySkills: [...initialUserState.skills], desiredSkills: [...initialUserState.lookingFor] });
            setAvatarFile(null);
            setAvatarPreview(initialUserState.avatar.url === DEFAULT_AVATAR.url ? null : initialUserState.avatar.url);
            setPasswords({ newPassword: "", confirmPassword: "" });
            setPasswordError("");
            setHasChanges(false);
            onClose?.();
        }
    }, [initialUserState]);

    const deleteUser = useCallback(async () => {
        await userService.deleteUser(userEdit.id);
        await authService.verifyAuth()

    }, [])

    return {
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
        t,
        deleteUser
    };


}
