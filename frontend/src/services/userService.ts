import axios from 'axios'
import { User } from '../types/authTypes'

const baseUrl = '/api/users'

const getUsers = async () => {
    const response = await axios.get(`${baseUrl}`, { withCredentials: true })
    return response.data
}
const getUserId = async (id: string) => {
    const response = await axios.get(`${baseUrl}/${id}`, { withCredentials: true })
    return response.data
}
const createUser = async (credentials: User) => {
    const response = await axios.post(`${baseUrl}`, credentials, { withCredentials: true })
    return response.data
}

const deleteUser = async (id: string) => {
    const response = await axios.delete(`${baseUrl}/${id}`, { withCredentials: true })
    return response.data
}

const updateUser = async (id: string, credentials: User) => {
    const response = await axios.patch(`${baseUrl}/${id}`, credentials, { withCredentials: true })
    return response.data
}

export default { getUsers, updateUser, getUserId, createUser, deleteUser };