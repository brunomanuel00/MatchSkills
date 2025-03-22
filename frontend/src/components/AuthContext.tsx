import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthResponse } from '../types/authTypes';

type AuthContextType = {
    user: User | null;
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (authResponse: AuthResponse) => {
        // Convierte AuthResponse en User
        const userData: User = {
            id: 'temp-id', // El backend debería devolver el ID del usuario
            name: authResponse.name,
            email: authResponse.email,
            skills: [], // Inicializa con valores por defecto
            lookingFor: [], // Inicializa con valores por defecto
            rol: 'user', // Inicializa con 'user' o 'admin' según el backend
        };
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};