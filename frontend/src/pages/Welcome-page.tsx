import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Target, TrendingUp, CheckCircle, ArrowRight, Building, Network } from "lucide-react";
import logo from "../assets/logo.webp";

import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { LanguageToggle } from "../components/language-toggle";
import { useAuth } from "../components/context/AuthContext";
import { useEffect } from "react";
import people from '../assets/team.webp';
import CountUp from "../components/CountUp";

export function WelcomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const logged = async () => {
            if (user) {
                navigate("/home");
            }
        };
        logged();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const stats = [
        { number: 500, symbol: "+", label: t("welcomePage.hero.stats.0.label") },
        { number: 150, symbol: "+", label: t("welcomePage.hero.stats.1.label") },
        { number: 95, symbol: "%", label: t("welcomePage.hero.stats.2.label") },
    ];

    const features = [
        {
            icon: Target,
            title: t("welcomePage.features.items.0.title"),
            description: t("welcomePage.features.items.0.description"),
        },
        {
            icon: Network,
            title: t("welcomePage.features.items.1.title"),
            description: t("welcomePage.features.items.1.description"),
        },
        {
            icon: TrendingUp,
            title: t("welcomePage.features.items.2.title"),
            description: t("welcomePage.features.items.2.description"),
        },
    ];

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header professional */}
            <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/home" className="flex items-center space-x-3">
                        <img className="rounded-lg w-10 h-10 object-cover" src={logo || "/placeholder.svg"} alt={t("welcomePage.header.logoAlt")} />
                        <span className="font-bold text-xl text-slate-800 dark:text-slate-200">{t("welcomePage.header.logoText")}</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Principal content */}
                        <motion.div className="space-y-8" variants={itemVariants}>
                            <div className="space-y-4">
                                <motion.div
                                    className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-blue-900/20 rounded-full text-green-700 dark:text-blue-300 text-sm font-medium"
                                    variants={itemVariants}
                                >
                                    <Building className="w-4 h-4 mr-2" />
                                    {t("welcomePage.hero.tagline")}
                                </motion.div>
                                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    {t("welcomePage.hero.titlePart1")}
                                    <span className="text-green-600 dark:text-blue-400"> {t("welcomePage.hero.titlePart2")} </span>
                                    {t("welcomePage.hero.titlePart3")}
                                </h1>

                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                    {t("welcomePage.hero.description")}
                                </p>
                            </div>

                            {/* Estadísticas */}
                            <motion.div
                                className="grid grid-cols-3 gap-8 py-8 border-t border-b border-slate-200 dark:border-slate-700"
                                variants={itemVariants}
                            >
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100"><CountUp
                                            from={0}
                                            to={stat.number}
                                            separator=","
                                            direction="up"
                                            duration={1}
                                            className="count-up-text"
                                        />{stat.symbol}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Botones de acción */}
                            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Link to="/register" className="flex items-center justify-center">
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        {t("welcomePage.hero.buttons.register")}
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 px-8 py-3 text-lg font-medium transition-all duration-300"
                                >
                                    <Link to="/login" className="flex items-center justify-center">
                                        <LogIn className="mr-2 h-5 w-5" />
                                        {t("welcomePage.hero.buttons.login")}
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Imagen profesional */}
                        <motion.div className="relative" variants={itemVariants}>
                            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={people}
                                    alt={t("welcomePage.hero.description")}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                                {/* Overlay con información */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex -space-x-2">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">JS</span>
                                                </div>
                                                <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">UX</span>
                                                </div>
                                                <div className="w-10 h-10 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">PM</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-slate-100">{t("welcomePage.hero.team")}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {t("welcomePage.hero.teamRoles")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            {t("welcomePage.features.title")}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            {t("welcomePage.features.description")}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 bg-green-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                                    <feature.icon className="w-6 h-6 text-green-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div className="space-y-8" variants={itemVariants}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100">
                            {t("welcomePage.cta.title")}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            {t("welcomePage.cta.description")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 dark:bg-blue-600 hdark:over:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
                            >
                                <Link to="/register" className="flex items-center">
                                    {t("welcomePage.cta.button")}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>

                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                <CheckCircle className="w-4 h-4 mr-2 text-blue-500 dark:text-green-500" />
                                {t("welcomePage.cta.footer")}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
}