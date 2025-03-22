import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn, UserPlus } from "lucide-react"
import logo from '../assets/Match de habilidades.jpg'

import { Button } from "../components/ui/button"
import { ThemeToggle } from "../components/theme-toggle"
import { LanguageToggle } from "../components/language-toggle"
// import { useState } from "react"

export function WelcomePage() {
    const { t } = useTranslation()
    // const [user, setUser] = useState<>

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    // useEffect(() => {
    //     const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    //     if (loggedUserJSON) {
    //         const user = JSON.parse(loggedUserJSON)
    //         setUser(user)
    //         blogService.setToken(user.token)
    //     }
    // }, [])

    return (
        <>

            <motion.div
                className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="top-4 right-4 flex justify-evenly space-x-2 ">
                    <div className="absolute top-4 left-5"><Link to='/'><img className=" rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" src={logo} alt="match de habilidades" /></Link> </div>
                    <div className=" absolute  top-4 right-4">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
                <motion.div
                    className="w-full max-w-lg mt-10 bg-white dark:bg-lapis_lazuli-400 rounded-2xl shadow-xl overflow-hidden"
                    variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 0.5 },
                        },
                    }}
                >
                    <div className="p-8 text-center space-y-8">
                        <motion.div className="space-y-2" variants={itemVariants}>
                            <h1 className="text-3xl font-bold text-lapis_lazuli dark:text-tea_green">{t("welcome.title")}</h1>
                            <p className="text-muted-foreground">{t("welcome.subtitle")}</p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <div className="h-32 w-32 mx-auto bg-emerald rounded-full flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, 0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "reverse",
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-16 w-16 text-white"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.p className="text-muted-foreground" variants={itemVariants}>
                            {t("welcome.description")}
                        </motion.p>

                        <motion.div className="flex flex-col space-y-3" variants={itemVariants}>
                            <Button
                                asChild
                                className="bg-lapis_lazuli hover:bg-lapis_lazuli-600 dark:bg-verdigris dark:hover:bg-verdigris-400"
                            >
                                <Link to="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    {t("welcome.login")}
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="border-lapis_lazuli text-lapis_lazuli hover:bg-lapis_lazuli/10 dark:border-verdigris dark:text-verdigris dark:hover:bg-verdigris/10"
                            >
                                <Link to="/register">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {t("welcome.register")}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    )
}

