import axios from "axios";
import { AuthCredentials, RegisterCredentials, AuthResponse } from "../types/authTypes";

const baseUrl = "/api/auth";

const login = async (credentials: AuthCredentials) => {
    const response = await axios.post<AuthResponse>(`${baseUrl}/login`, credentials)
    return response.data
}

const register = (credentials: RegisterCredentials) => {
    axios.post<AuthResponse>(`${baseUrl}/register`, credentials).then((res) => res.data);
}

export default { login, register };
