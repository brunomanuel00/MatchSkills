import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SpinnerProps {
    isModal?: boolean;
}

export const Spinner = ({ isModal = false }: SpinnerProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        setIsMounted(true);

        // Solo acceder a localStorage y window después del montaje
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem("theme") ||
                (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            setTheme(storedTheme);
        }
    }, []);

    if (!isMounted) {
        return (
            <div className="h-screen w-full flex justify-center items-center bg-gray-100 dark:bg-gray-900">
                <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
            </div>
        );
    }

    // Estilo para modal (con blur)
    if (isModal) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
                <Loader2 className={`h-16 w-16 animate-spin ${theme === 'light' ? 'text-blue-500' : 'text-white'}`} />
            </div>
        );
    }

    // Estilo normal (con gradient)
    return (
        <div className={`h-screen w-full flex justify-center items-center 
            ${theme === 'light'
                ? 'bg-gradient-to-br from-tea_green-500 to-light_green-300'
                : 'bg-gradient-to-br from-lapis_lazuli-500 to-verdigris-700'
            }`}
        >
            <Loader2 className={`h-16 w-16 animate-spin ${theme === 'light' ? 'text-blue-500' : 'text-white'}`} />
        </div>
    );
};