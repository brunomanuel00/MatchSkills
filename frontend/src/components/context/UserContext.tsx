import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "../../types/authTypes";
import userService from "../../services/userService";
import { toastEasy } from "../hooks/toastEasy";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import axios from "axios";
interface UserContextValue {
    // Estados
    users: User[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalUsers: number;
    loading: boolean;
    selectedUsers: string[];
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    userToEdit?: User;
    loadingUser: boolean;

    // Funciones
    setPageSize: (size: number) => void;
    setCurrentPage: (page: number) => void;
    refreshUsers: () => Promise<void>;
    handleSelectionToggle: (userId: string) => void;
    handleSelectAll: () => void;
    handleDeleteSelected: () => void;
    editUser: (userId: string) => Promise<void>;
    closeEditModal: () => void;
    closeDeleteModal: () => void;
    openDeleteModal: () => void;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUsers() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUsers must be used within UserProvider");
    return context;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // Estados principales
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    // Estados de selección
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Estados de edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User>();
    const [loadingUser, setLoadingUser] = useState(false);

    const loadUsers = useCallback(async (newPage?: number, newSize?: number) => {
        try {
            setLoading(true);

            if (user?.rol !== 'admin') return
            const response = await userService.getUsers(
                newPage || currentPage,
                newSize || pageSize
            );

            // Validación de tipos
            if (!response.pagination || typeof response.pagination.total !== 'number') {
                return
            }

            setUsers(response.users);
            setTotalUsers(Number(response.pagination.total)); // Conversión explícita
            setTotalPages(Number(response.pagination.totalPages));

        } catch (error) {
            toastEasy('error')
            toastEasy("error", t("errorMessages.loadingUsers"));
            setTotalUsers(0); // Resetear a 0 en caso de error
        } finally {
            setLoading(false);
        }
    }, [])

    // Efectos
    useEffect(() => {
        loadUsers();
    }, [user]);

    // Handlers
    const handleSelectionToggle = useCallback((userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }, [])

    const handleSelectAll = () => {
        setSelectedUsers(prev =>
            prev.length === users.length
                ? []
                : users.map(user => user.id)
        );
    }

    const handleDeleteSelected = useCallback(async () => {
        try {
            if (selectedUsers.length === 0) return;

            setLoading(true);

            // Confirmación básica
            await userService.deleteArrayUsers(selectedUsers);

            toastEasy('success', t('toaster.delete-success'))
            // Actualización después de éxito
            setSelectedUsers([]);
            refreshUsers();

        } catch (error) {
            let errorMessage = 'Failed to delete users';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            toastEasy("error", `${errorMessage}`);
        } finally {
            setLoading(false);
            setIsDeleteModalOpen(false);

        }
    }, [selectedUsers]);

    const editUser = useCallback(async (userId: string) => {
        setIsEditModalOpen(true);
        setLoadingUser(true);
        try {
            const userData = await userService.getUserId(userId);
            setUserToEdit(userData);

        } catch (error) {
            toastEasy("error", t("errorMessages.fetchingUser"));
        } finally {
            setLoadingUser(false);
        }
    }, [])

    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setUserToEdit(undefined);
    }, [])

    const refreshUsers = useCallback(async () => {
        await loadUsers();
    }, [])

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    }

    const closeDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, [])

    return (
        <UserContext.Provider
            value={{
                users,
                currentPage,
                pageSize,
                totalPages,
                totalUsers,
                loading,
                selectedUsers,
                isEditModalOpen,
                isDeleteModalOpen,
                userToEdit,
                loadingUser,
                setUsers,
                setPageSize: (size) => {
                    setPageSize(size);
                    loadUsers(1, size);
                },
                setCurrentPage: (page) => {
                    if (page === currentPage) {
                        return
                    }
                    setCurrentPage(page);
                    loadUsers(page);
                },
                refreshUsers,
                handleSelectionToggle,
                handleSelectAll,
                handleDeleteSelected,
                editUser,
                closeEditModal,
                closeDeleteModal,
                openDeleteModal
            }}
        >
            {children}
        </UserContext.Provider>
    );
};