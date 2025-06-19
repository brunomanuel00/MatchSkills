import { useMatch } from "../components/context/MatchContext"
import { Spinner } from "../components/ui/spinner"
import CardMatches from "../components/CardMatches";
import { useTranslation } from "react-i18next";
import { Waypoints } from "lucide-react";

export default function MatchesPage() {
    const { loading, matches } = useMatch()
    const { t } = useTranslation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <Spinner />
            </div >
        )
    }
    if (!Array.isArray(matches)) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <p className="text-red-500">Error al cargar los matches</p>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <div className="text-center mt-24 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <Waypoints className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t('matches.empty.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('matches.empty.description')}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen pt-20 p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">{t('matches.title')}</h1>
                <div className="mx-auto w-full max-w-[1600px] px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-3 justify-items-center">
                        {matches?.map((item) => (
                            <div key={item.id} className="w-full max-w-[350px] bg-light_green-800 dark:bg-slate-950/50 rounded-md p-4 flex flex-col">
                                <CardMatches user={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}