import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"

import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function LanguageToggle() {
    const { i18n, t } = useTranslation()

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language")
        if (savedLanguage && i18n.language !== savedLanguage) {
            i18n.changeLanguage(savedLanguage)
        }
    }, [i18n])

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
        localStorage.setItem("language", lng)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button title={t('language')} variant="ghost" size="icon" className="rounded-full">
                    <motion.div transition={{ duration: 0.2 }}>
                        <Globe className="h-5 w-5 text-lapis_lazuli dark:text-tea_green" />
                        <span className="sr-only">{t("language")}</span>
                    </motion.div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English {i18n.language === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("es")}>
                    Español {i18n.language === "es" && "✓"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

