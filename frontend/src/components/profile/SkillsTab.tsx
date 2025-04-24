import { motion } from "framer-motion";
import { SkillsSelector } from "./SkillsSelector";
import { SelectedSkills } from "../../types/skillTypes";

interface SkillsTabProps {
    skills: SelectedSkills;
    onSkillsChange: (skills: SelectedSkills) => void;
}

export const SkillsTab = ({ skills, onSkillsChange }: SkillsTabProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <SkillsSelector
                currentSkills={skills}
                onSkillsChange={onSkillsChange}
            />
        </motion.div>
    );
};