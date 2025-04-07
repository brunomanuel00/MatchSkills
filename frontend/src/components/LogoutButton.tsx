import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const { logout } = useAuth();
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/')
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <Button
            title={t('session.close')}
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-white dark:hover:bg-neutral-800"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <LogOut className="h-5 w-5 text-lapis_lazuli dark:text-white" />
                <span className="sr-only">{t('session.close')}</span>
            </motion.div>
        </Button>
    );
};