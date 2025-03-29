import axios from "axios";
import { AuthCredentials, LoginResponse, RegisterCredentials, User } from "../types/authTypes";

const baseUrl = "/api/auth";

const login = async (credentials: AuthCredentials) => {
    const response = await axios.post<LoginResponse>(`${baseUrl}/login`, credentials, { withCredentials: true })
    return response.data
}

const logout = async () => {
    const response = await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true })
    return response.data
}

const verifyAuth = async () => {
    const response = await axios.get(`${baseUrl}/verify-auth`, { withCredentials: true });
    return response.data;
}

const register = async (credentials: RegisterCredentials) => {
    const response = await axios.post<User>(`${baseUrl}/register`, credentials)
    return response.data
}
const patchtest = async (id: string, credentials: object) => {
    const response = await axios.patch(`http://localhost:3001/api/users/${id}`, credentials, { withCredentials: true })
    return response.data
}


export default { login, register, logout, verifyAuth, patchtest };
