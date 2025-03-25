import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Spinner = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-screen w-full flex justify-center items-center bg-gray-100 dark:bg-gray-900">
                <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
            </div>
        );
    }

    const theme = typeof window !== 'undefined' ?
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : "light";

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