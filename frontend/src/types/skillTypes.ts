export type SkillCategory =
    'technology' |
    'design' |
    'business' |
    'languages' |
    'arts' |
    'crafts' |
    'sciences' |
    'others';

export interface Skill {
    id: string;
    category: SkillCategory;
}

export interface SelectedSkills {
    mySkills: Skill[];
    desiredSkills: Skill[];
}

export interface SkillsSelectorProps {
    currentSkills: SelectedSkills;
    onSkillsChange: (skills: SelectedSkills) => void;
    maxSkills?: number;
}
