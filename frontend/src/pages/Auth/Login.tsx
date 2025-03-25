import type React from "react"
import axios from "axios"


import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ThemeToggle } from "../../components/theme-toggle"
import { LanguageToggle } from "../../components/language-toggle"
import logo from '../../assets/Match de habilidades.jpg'
import { useAuth } from '../../components/context/AuthContext';
import { AuthCredentials } from "../../types/authTypes"

export function Login() {
    const { t } = useTranslation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [errorType, setErrorType] = useState<string | null>(null);
    const { login, user } = useAuth()

    useEffect(() => {
        const logged = async () => {
            if (user) {
                navigate('/home')
            }
        }
        logged();

    }, [])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorType(null);
        try {
            const credentials: AuthCredentials = { email, password };
            const rol = await login(credentials);
            if (rol === 'user') {
                navigate('/home')
            } else if (rol === 'admin') {
                navigate('/admin-dashboard')
            } else {
                throw new Error('Something gone wrong with permission')
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setErrorType(err.response?.status === 401 ? 'invalidCredentials' : 'genericError');
            }
        }
    }


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
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    }

    return (
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
                className="w-full max-w-md bg-white dark:bg-lapis_lazuli-400 rounded-2xl shadow-xl overflow-hidden"
                variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.5 },
                    },
                }}
            >
                <div className="p-8">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center">
                            <motion.h1 className="text-3xl font-bold text-lapis_lazuli dark:text-tea_green" variants={itemVariants}>
                                {t("login.title")}
                            </motion.h1>
                            <motion.p className="text-muted-foreground" variants={itemVariants}>
                                {t("login.subtitle")}
                            </motion.p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errorType &&
                                <motion.div
                                    className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{t(`login.errors.${errorType}`)}</span>
                                </motion.div>}
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="email">{t("login.email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-verdigris focus:ring-emerald text-foreground dark:text-foreground bg-background dark:bg-lapis_lazuli-300 placeholder:text-muted-foreground"
                                />
                            </motion.div>

                            <motion.div className="space-y-2" variants={itemVariants}>
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">{t("login.password")}</Label>
                                    <a href="#" className="text-xs text-emerald hover:underline">
                                        {t("login.forgotPassword")}
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border-verdigris focus:ring-emerald pr-10 text-foreground dark:text-foreground bg-background dark:bg-lapis_lazuli-300 placeholder:text-muted-foreground"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    className="w-full bg-lapis_lazuli hover:bg-lapis_lazuli-600 dark:bg-verdigris dark:hover:bg-verdigris-400"
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    {t("login.button")}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div variants={itemVariants} className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                {t("login.noAccount")}{" "}
                                <Link to="/register" className="text-emerald hover:underline font-medium transition-colors">
                                    {t("login.signUp")}
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

