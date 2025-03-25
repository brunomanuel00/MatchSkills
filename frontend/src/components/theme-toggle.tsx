import { useTheme } from "./context/theme-context";
import { Button } from "../components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            title={t('theme.toggle')}
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                key={theme}
            >
                {theme === "light" ? (
                    <Sun className="h-5 w-5 text-lapis_lazuli" />
                ) : (
                    <Moon className="h-5 w-5 text-tea_green" />
                )}
            </motion.div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}