import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../types/authTypes";
import userService from "../../services/userService";
import { toastEasy } from "../hooks/toastEasy";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui/spinner";
import { useAuth } from "./AuthContext";

interface UserContextValue {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    refreshUsers: () => Promise<void>;
    loading: boolean
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUsers() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUsers must be used within UserProvider");
    return context;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const { user } = useAuth()
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const loadUsers = async () => {
        try {
            if (user?.rol === 'admin') {
                const response = await userService.getUsers();
                setUsers(response)
            }

        } catch (err) {
            console.error(err)
            toastEasy("error", t("errorMessages.loadingUsers"));
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadUsers();
    }, [user]);


    if (loading) {
        return <Spinner />;
    }

    return (
        <UserContext.Provider value={{ users, setUsers, refreshUsers: loadUsers, loading }}>
            {children}
        </UserContext.Provider>
    );
};


