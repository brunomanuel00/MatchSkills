import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { motion } from "framer-motion";
import { LanguageToggle } from "../components/language-toggle";
import { ThemeToggle } from "../components/theme-toggle";
import logo from '../assets/match de habilidades.jpg'

export default function HomePage() {
    const { user } = useAuth(); // Obtén el usuario del contexto
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Si no hay usuario autenticado, redirige a la página de inicio
            navigate('/');
        }
    }, [user, navigate]);

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
                <div className="absolute top-4 left-5"><Link to='/home'><img className=" rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" src={logo} alt="match de habilidades" /></Link> </div>
                <div className=" absolute top-4 right-4 flex">
                    <LanguageToggle />
                    <ThemeToggle />
                    <LogoutButton />
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
            </motion.div>
        </motion.div>
    )
}