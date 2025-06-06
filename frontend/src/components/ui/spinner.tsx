import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SpinnerProps {
    isModal?: boolean;
}

export const Spinner = ({ isModal = true }: SpinnerProps) => {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const updateTheme = () => {
            const storedTheme = localStorage.getItem("theme") as "light" | "dark" ||
                (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            setTheme(storedTheme);
        };

        // Detectar tema inmediatamente
        updateTheme();

        // Escuchar cambios en tiempo real
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    if (isModal) {
        return (
            <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
                <Loader2 className={`h-16 w-16 animate-spin ${theme === 'light' ? 'text-blue-600' : 'text-verdigris-400'
                    }`} />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center z-51 space-x-1">
            <span
                className={`h-3 w-3 rounded-full animate-bounce-dots ${theme === 'light' ? 'bg-white' : 'bg-white'
                    }`}
            ></span>
            <span
                className={`h-3 w-3 rounded-full animate-bounce-dots ${theme === 'light' ? 'bg-white' : 'bg-white'
                    }`}
                style={{ animationDelay: '0.2s' }}
            ></span>
            <span
                className={`h-3 w-3 rounded-full animate-bounce-dots ${theme === 'light' ? 'bg-white' : 'bg-white'
                    }`}
                style={{ animationDelay: '0.4s' }}
            ></span>
        </div>
    );
};