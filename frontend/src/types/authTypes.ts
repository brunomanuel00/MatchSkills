export interface User {
    id: string;
    name: string;
    email: string;
    skills: string[];
    lookingFor: string[];
    rol: "user" | "admin";
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

