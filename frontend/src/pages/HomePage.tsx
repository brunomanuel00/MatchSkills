import { useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation()

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
            <div>
                <h1 className=" font-bold text-6xl">{t('welcome.title')}</h1>
            </div>
            <div>
                <p className=" m-12">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus ad voluptas veritatis pariatur delectus officiis exercitationem autem blanditiis sapiente, doloribus voluptates accusantium reiciendis ullam velit atque eligendi nisi? Culpa, exercitationem!</p>
            </div>
        </div>
    );
}