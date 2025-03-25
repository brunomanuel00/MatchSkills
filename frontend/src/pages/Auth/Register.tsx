import type React from "react";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import axios from "axios";


import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ThemeToggle } from "../../components/theme-toggle";
import { LanguageToggle } from "../../components/language-toggle";
import logo from '../../assets/Match de habilidades.jpg';
import authService from '../../services/auth';
import { RegisterCredentials } from "../../types/authTypes";
import { useAuth } from '../../components/context/AuthContext';

export function Register() {
    const { t } = useTranslation()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [error, setError] = useState<string | null>(null);
    const rol = "user";
    const { login, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const logged = async () => {
            if (user) {
                navigate('/home')
            }
        }
        logged();

    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setPasswordError(t("validation.passwordMatch"))
            return
        }
        try {
            const user: RegisterCredentials = { name, email, password, skills: [], lookingFor: [], rol }
            const dataUser = await authService.register(user)
            const credentials = { email: dataUser.email, password }
            login(credentials)
            navigate('/home')
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.error === 'invalidEmail') {
                setError(err.response.data.error);
            } else {
                setError('genericError');
            }
        }

    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.2,
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
            className="min-h-screen  flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700"
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
                className="w-full max-w-md mt-10 bg-white dark:bg-lapis_lazuli-400 rounded-2xl shadow-xl overflow-hidden"
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
                                {t("register.title")}
                            </motion.h1>
                            <motion.p className="text-muted-foreground" variants={itemVariants}>
                                {t("register.subtitle")}
                            </motion.p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="name">{t("register.name")}</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="border-verdigris focus:ring-emerald text-foreground dark:text-foreground bg-background dark:bg-lapis_lazuli-300 placeholder:text-muted-foreground"
                                />
                            </motion.div>

                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="register-email">{t("register.email")}</Label>
                                {error &&
                                    <motion.div
                                        className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{t(`register.errors.${error}`)}</span>
                                    </motion.div>}
                                <Input
                                    id="register-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-verdigris focus:ring-emerald text-foreground dark:text-foreground bg-background dark:bg-lapis_lazuli-300 placeholder:text-muted-foreground"
                                />
                            </motion.div>

                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="register-password">{t("register.password")}</Label>
                                <div className="relative">
                                    <Input
                                        id="register-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        minLength={8}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (confirmPassword && e.target.value !== confirmPassword) {
                                                setPasswordError(t("validation.passwordMatch"))
                                            } else {
                                                setPasswordError("")
                                            }
                                        }}
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

                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="confirm-password">{t("register.confirmPassword")}</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        minLength={8}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            if (password && e.target.value !== password) {
                                                setPasswordError(t("validation.passwordMatch"))
                                            } else {
                                                setPasswordError("")
                                            }
                                        }}
                                        required
                                        className={`border-verdigris focus:ring-emerald pr-10 text-foreground dark:text-foreground bg-background dark:bg-lapis_lazuli-300 placeholder:text-muted-foreground ${passwordError ? "border-destructive" : ""
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordError &&
                                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-white dark:text-red-600 rounded-md">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-xs text-destructive"> {passwordError}</p>
                                    </div>}
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    className="w-full bg-lapis_lazuli hover:bg-lapis_lazuli-600 dark:bg-verdigris dark:hover:bg-verdigris-400"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {t("register.button")}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div variants={itemVariants} className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                {t("register.haveAccount")}{" "}
                                <Link to="/login" className="text-emerald hover:underline font-medium transition-colors">
                                    {t("register.signIn")}
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

