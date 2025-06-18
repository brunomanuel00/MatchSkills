import { Button } from "./ui/button"
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { UserMatched } from "../types/matchTypes"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Mail } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useCallback, useState } from "react"
import { Skill } from "../types/skillTypes"
import { Modal } from "./Modal"
import Chat from "./Chat"
import { toastEasy } from "./hooks/toastEasy"


export default function CardMatches({ user }: UserMatched) {
    const { t } = useTranslation()
    const [isSkillsModalOpen, setSkillsModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [skills, setSkills] = useState<Skill[] | undefined>(undefined)

    const getTranslatedSkillName = useCallback((skill: Skill) => {
        try {
            return t(`skills.${skill.category}.${skill.id}`);
        } catch (error) {
            toastEasy('error')
            return skill.id;
        }
    }, [t]);

    const closeSkillsModal = () => {
        setSkillsModalOpen(false)
    }
    const closeChatModal = () => {
        setIsChatModalOpen(false)
    }

    return (
        <>
            <div >
                {/* Header con altura fija */}
                <CardHeader className="flex flex-row items-center p-2">
                    <div className="w-12 h-12 shrink-0">
                        <AspectRatio ratio={1 / 1}>
                            <img
                                src={user.avatar.url}
                                alt={user.name}
                                className="rounded-full object-cover w-full h-full"
                            />
                        </AspectRatio>
                    </div>
                    <CardTitle className="ml-3 text-lg truncate max-w-[200px]">{user.name}</CardTitle>
                </CardHeader>

                {/* Contenido con altura flexible y scroll */}
                <CardContent className="flex-1 p-2">
                    <div className="flex items-center gap-2 text-cyan-950 dark:text-teal-500 ">
                        <Mail className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 my-2">
                        <span className="text-sm text-slate-600 dark:text-teal-600">{t('matches.skills-found')}:</span>
                        <span className="text-sm font-medium text-black dark:text-white">{user.matchingSkills.length}</span>
                    </div>
                </CardContent>

                {/* Footer con altura fija */}
                <CardFooter className="p-2">
                    <Button onClick={() => {
                        setSkills(user.matchingSkills)
                        setSkillsModalOpen(true)
                    }} className="w-full m-1">
                        {t('matches.view-skills')}
                    </Button>
                    <Button onClick={() => {
                        setSkills(user.matchingSkills)
                        setIsChatModalOpen(true)
                    }} className="w-full m-1">
                        {t('matches.chat')}
                    </Button>
                </CardFooter>
            </div>
            <Modal
                isOpen={isSkillsModalOpen}
                onClose={closeSkillsModal}
                title={t('matches.skills-found')}
                size="md"
                large={false}
            >
                <div className="flex flex-wrap gap-2 m-4">
                    {skills?.map((item) => (
                        <p key={item.id} className="bg-teal-800 text-white p-3 rounded-lg">{getTranslatedSkillName(item)}</p>
                    ))}
                </div>

            </Modal>
            <Modal
                isOpen={isChatModalOpen}
                onClose={closeChatModal}
                title={t('matches.chat')}
                size="md"
                large={false}
            >
                <Chat receivedUserId={user.id} onClose={closeChatModal} />

            </Modal>
        </>
    )
}