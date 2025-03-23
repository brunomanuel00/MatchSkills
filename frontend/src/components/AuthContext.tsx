import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/authTypes';
import authService from "../services/auth"
import { Spinner } from './ui/spinner';

type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean
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

    // Verifica la autenticación al cargar la aplicación
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const userData = await authService.verifyAuth();
                setUser(userData); // Actualiza el estado del usuario
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false); // Indica que la verificación ha terminado
            }
        };

        verifyAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        setUser(null);
        await authService.logout()

    };

    // Evita renderizar la aplicación hasta que se complete la verificación inicial
    if (loading) {
        return <Spinner></Spinner>; // Puedes mostrar un spinner o un mensaje de carga
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};