import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "../components/ui/button"
import { useTranslation } from "react-i18next"

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light")
    const { t } = useTranslation()

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null
        if (storedTheme) {
            setTheme(storedTheme)
            document.documentElement.classList.toggle("dark", storedTheme === "dark")
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark")
            document.documentElement.classList.add("dark")
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
        localStorage.setItem("theme", newTheme)
    }

    return (
        <Button title={t('theme.toggle')} variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full ">
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
    )
}

