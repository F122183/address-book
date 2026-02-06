import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import api from '../api/axios';

interface User {
    _id: string;
    username: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (formData: any) => Promise<void>;
    register: (formData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (formData: any) => {
        const { data } = await api.post('/auth/login', formData);
        setUser(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const register = async (formData: any) => {
        const { data } = await api.post('/auth/register', formData);
        setUser(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
