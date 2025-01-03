import { create } from 'zustand';
import { apiClient } from '@/lib/axios';
import Cookies from 'js-cookie';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    isAuthenticated: !!Cookies.get('token'),
    initAuth: async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const response = await apiClient.get('/auth/user');
                set({ user: response.data.data, isAuthenticated: true });
            } catch (error) {
                Cookies.remove('token');
                set({ user: null, isAuthenticated: false });
                throw error;
            }
        }
    },
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { token, user } = response.data;
            Cookies.set('token', token);
            set({ user, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/register', { name, email, password });
            const { token, user } = response.data;
            Cookies.set('token', token);
            set({ user, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },
    logout: () => {
        Cookies.remove('token');
        set({ user: null, isAuthenticated: false });
    },
}));
