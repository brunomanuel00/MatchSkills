import { SkillCategory } from "./skillTypes";

export interface MatchingSkill {
    id: string;
    category: SkillCategory;

}

export interface Avatar {
    public_id: string;
    url: string;
}

export interface MatchedUser {
    id: string;
    name: string;
    email: string;
    avatar: Avatar;
    matchingSkills: MatchingSkill[];
}

export interface UserMatched {
    user: MatchedUser;
}
