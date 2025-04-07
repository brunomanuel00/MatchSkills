import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthCredentials } from '../../types/authTypes';
import authService from "../../services/authService"
import { Spinner } from '../ui/spinner';
import axios from 'axios';


type AuthContextType = {
    user: Readonly<User> | null;
    login: (credentials: AuthCredentials) => Promise<NonNullable<User['rol']>>;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Readonly<User> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const userData = await authService.verifyAuth();
                setUser(userData as Readonly<User>)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {


                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (credentials: AuthCredentials): Promise<NonNullable<User['rol']>> => {
        const userData = await authService.login(credentials);

        if (!userData?.user?.rol) {
            throw new Error('Role not found in user data');
        }


        setUser(userData.user as Readonly<User>);
        return userData.user.rol;

        //usar try/catch en caso de que se quiera mostrar algun toast
    };

    const logout = async () => {
        setUser(null);
        await authService.logout()

    };
    const updateUser = (updatedUser: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            return Object.freeze({ ...prev, ...updatedUser });
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