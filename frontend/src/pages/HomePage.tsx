import { useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion";
import { Skill } from "../types/skillTypes";
import { SquareArrowOutUpRight } from "lucide-react";

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation()
    const skills: Skill[] | undefined = user?.skills as Skill[] | undefined;

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user]);

    const getTranslatedSkillName = (skill: Skill) => {
        try {
            return t(`skills.${skill.category}.${skill.id}`);
        } catch (error) {
            console.error(`Translation not found for skill: ${skill.category}.${skill.id}`);
            return skill.id;
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <div className=" md:px-40 ">
                    <h2 className=" font-bold text-center text-5xl sm:text-6xl">{t('home.title')}</h2>
                </div>
                <div>
                    <h3 className="m-12 text-2xl">{t('home.subtitle')}</h3>
                </div>
            </div>
            <div
                className="flex flex-col items-center justify-center p-4 bg-slate-200 dark:bg-slate-900">
                <motion.div initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    <h2 className="text-5xl font-semibold sm:text-6xl">{t('home.title-skills')}</h2>
                </motion.div>
                <div>
                    <ul className="flex flex-wrap justify-start items-center p-12 ">
                        {skills?.length === 0 &&
                            <div >
                                <h2 className="flex flex-nowrap">{t('home.without-skills')}<Link className="text-blue-600 hover:text-blue-400" to='/profile?tab=skills'><SquareArrowOutUpRight className="h-4 w-4 mt-1" /></Link></h2>
                            </div>}
                        {skills?.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                // whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                                className=" m-2 md:m-4 rounded-xl p2 md:p-4 text-center">
                                <li className="text-lg sm:text-xl">
                                    {getTranslatedSkillName(skill)}
                                </li>
                            </motion.div>
                        ))}

                    </ul>
                </div>
            </div >
            {skills?.length !== 0 &&
                <div className="flex flex-col items-center justify-center p-4  bg-lig bg-verdigris-400 dark:bg-lapis_lazuli-400">
                    <div className=" md:px-40 ">
                        <h2 className=" font-bold text-center text-5xl sm:text-6xl">{t('home.suggested')}</h2>
                    </div>
                    <div>
                        <h3 className="m-11 text-2xl">{t('home.subtitle-suggested')}</h3>
                    </div>
                </div>

            }
        </>
    );
}