import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthCredentials } from '../../types/authTypes';
import authService from "../../services/authService"
import { Spinner } from '../ui/spinner';
import axios from 'axios';


type AuthContextType = {
    user: User | null;
    login: (credentials: AuthCredentials) => Object;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const userData = await authService.verifyAuth();
                setUser(userData)
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (credentials: AuthCredentials) => {
        try {
            const userData = await authService.login(credentials);

            if (!userData?.user?.rol) {
                throw new Error('Role not found in user data');
            }

            setUser(userData.user);
            return userData.user.rol;

        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        await authService.logout()

    };
    const updateUser = (updatedUser: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...updatedUser };
        });
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};