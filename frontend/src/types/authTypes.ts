import { Skill } from "./skillTypes";
export interface User {
    id: string;
    name: string;
    email: string;
    skills: Skill[];
    lookingFor: Skill[];
    rol: "user" | "admin";
    avatar: {
        public_id: String,
        url: String
    }
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends AuthCredentials {
    name: string;
    skills: string[];
    lookingFor: string[];
    rol: "user" | "admin";
}

export interface LoginResponse {
    user: User;
    message: string;
}
