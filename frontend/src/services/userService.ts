import axios from 'axios';
import { User } from '../types/authTypes';
import { Skill } from '../types/skillTypes';


const baseUrl = '/api/users';

// Configuración base de axios
const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

const getUsers = async () => {
    const response = await apiClient.get('/');
    return response.data;
};

const getUserId = async (id: string) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
};

const createUser = async (credentials: User) => {
    const response = await apiClient.post('/', credentials);
    return response.data;
};

const deleteUser = async (id: string) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};

const updateUser = async (id: string, updateData: {
    id?: string
    name?: string;
    email?: string;
    skills?: Skill[];
    lookingFor?: Skill[];
    password?: string;
    rol?: string,
    avatar?: File | string;
}) => {
    const formData = new FormData();

    // Añadir campos básicos
    if (updateData.name !== undefined) formData.append('name', updateData.name);
    if (updateData.email !== undefined) formData.append('email', updateData.email);
    if (updateData.rol !== undefined) formData.append('rol', updateData.rol);

    // Manejo especial para skills y lookingFor
    if (updateData.skills !== undefined) {
        formData.append('skills', JSON.stringify(updateData.skills));
    }
    if (updateData.lookingFor !== undefined) {
        formData.append('lookingFor', JSON.stringify(updateData.lookingFor));
    }

    // Contraseña y avatar
    if (updateData.password !== undefined) formData.append('password', updateData.password);
    if (updateData.avatar !== undefined) {
        if (typeof updateData.avatar === 'string') {
            formData.append('avatar', updateData.avatar);
        } else {
            formData.append('avatar', updateData.avatar);
        }
    }

    // Debug: Mostrar contenido del FormData
    console.log('Contenido de FormData:');
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        const response = await apiClient.patch(`/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error detallado:', error.response?.data);
            const errorData = error.response?.data;
            throw new Error(errorData?.message || errorData?.error || 'Error al actualizar usuario');
        }
        throw error;
    }
};

export default {
    getUsers,
    updateUser,
    getUserId,
    createUser,
    deleteUser
};