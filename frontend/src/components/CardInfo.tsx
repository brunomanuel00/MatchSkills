
import { ContentCardInfo } from "../types/utils"
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "./ui/card"


export default function CardInfo({ content }: ContentCardInfo) {

    return (
        <>
            <div className="w-full h-full max-h-[250px] max-w-[350px] bg-light_green-800/25 hover:bg-light_green-800/10 dark:bg-slate-950/25 dark:hover:bg-slate-950/10 rounded-md p-4 flex flex-col" >
                {/* Header con altura fija */}
                <CardHeader className="flex justify-start items-start p-2">
                    <div className="bg-slate-200/50 p-2 rounded-3xl">
                        {content.icon}
                    </div>
                </CardHeader>

                {/* Contenido con altura flexible y scroll */}
                <CardContent className="flex-1 p-2 ">
                    <CardTitle className=" text-lg truncate mb-4">{content.title}</CardTitle>
                    <CardDescription className=" text-md text-slate-900 dark:text-slate-300 ">{content.description}</CardDescription>
                </CardContent>
            </div>

        </>
    )
}