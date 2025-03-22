import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();

    if (!user) {
        // Si no hay usuario autenticado, redirige a la página de inicio de sesión
        return <Navigate to="/login" replace />;
    }

    // Si el usuario está autenticado, renderiza el componente hijo
    return <>{children}</>;
};

export default ProtectedRoute;