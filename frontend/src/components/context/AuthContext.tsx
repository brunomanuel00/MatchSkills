import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthCredentials } from '../../types/authTypes';
import authService from "../../services/auth"
import { Spinner } from '../ui/spinner';

type AuthContextType = {
    user: User | null;
    login: (credentials: AuthCredentials) => Object;
    logout: () => void;
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
                setUser(userData);
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

    if (loading) {
        return <Spinner />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};