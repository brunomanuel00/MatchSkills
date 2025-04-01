import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthCredentials } from '../../types/authTypes';
import authService from "../../services/auth"
import { Spinner } from '../ui/spinner';

type AuthContextType = {
    user: User | null;
    login: (credentials: AuthCredentials) => Object;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // const userData = await authService.verifyAuth();
                // setUser(userData)
                setUser({
                    "name": "Bruno",
                    "email": "bruno@gmail.com",
                    "skills": [
                        { id: 'js', category: 'technology' },
                        { id: 'java', category: 'technology' },
                        { id: 'csharp', category: 'technology' },
                        { id: 'illustrator', category: 'design' },
                        { id: 'indesign', category: 'design' },
                        { id: 'ae', category: 'design' },
                        { id: 'premiere', category: 'design' },
                        { id: 'blender', category: 'design' },
                        { id: '3dmax', category: 'design' },
                        { id: 'maya', category: 'design' },
                        { id: 'cinema4d', category: 'design' },
                        { id: 'content', category: 'business' },
                        { id: 'email', category: 'business' },
                        { id: 'mentoring', category: 'others' },
                        { id: 'translation', category: 'others' },
                    ],
                    "lookingFor": [
                        { id: 'solidity', category: 'technology' },
                        { id: 'arduino', category: 'technology' },
                        { id: 'raspberry', category: 'technology' },
                        { id: 'iot', category: 'technology' },
                    ],
                    "rol": "admin",
                    "id": "67dcbf88e9340ef0f5238f8b",
                    "avatar": {
                        "public_id": "default_avatars/default_avatars.svg_lszftj",
                        "url": "https://res.cloudinary.com/decnbbgn8/image/upload/v1743115286/default_avatars.svg_lszftj.png"
                    }
                });
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (credentials: AuthCredentials) => {
        try {
            const userData = await authService.login(credentials);

            if (!userData?.user?.rol) {
                throw new Error('Role not found in user data');
            }

            setUser(userData.user);
            return userData.user.rol;

        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        await authService.logout()

    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};