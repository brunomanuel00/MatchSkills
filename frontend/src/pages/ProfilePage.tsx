import { useState } from "react"
import { useAuth } from "../components/context/AuthContext"
import { User } from "../types/authTypes"
import { SkillsSelector } from "../components/SkillsSelector"
import { SelectedSkills } from "../types/skillTypes";

export default function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<User>(user ?? {} as User)
    const trp: SelectedSkills = { mySkills: profile?.skills ?? [], desiredSkills: profile?.lookingFor ?? [] }

    const handleSkillsChange = (skills: SelectedSkills) => {
        console.log('Skills updated:', skills);
    };


    return (
        <>
            <div className="min-h-screen flex flex-col items-center text-neutral-950 justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <div className="mt-20">
                    <h1 className="font-bold text-6xl">This is profile</h1>
                </div>
                <div className=" m-20">
                    <SkillsSelector initialSkills={trp} onSkillsChange={handleSkillsChange} />
                </div>
            </div>


        </>
    )
}