import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useLogOut() {
    const navigate = useNavigate()
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/')
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return handleLogout;
}