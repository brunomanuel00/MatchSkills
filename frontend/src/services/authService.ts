import axios from "axios";
import { AuthCredentials, LoginResponse, RegisterCredentials, User } from "../types/authTypes";

const baseUrl = "/api/auth";

const login = async (credentials: AuthCredentials) => {
    const response = await axios.post<LoginResponse>(`${baseUrl}/login`, credentials, { withCredentials: true })
    return response.data
}

const logout = async () => {
    const response = await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true })
    return response
}

const verifyAuth = async () => {
    try {
        const response = await axios.get(`${baseUrl}/verify-auth`, { withCredentials: true });
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {

        }

    }
}

const register = async (credentials: RegisterCredentials) => {
    const response = await axios.post<User>(`${baseUrl}/register`, credentials)
    return response.data
}


export default { login, register, logout, verifyAuth };
