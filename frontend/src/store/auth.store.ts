import { create } from 'zustand';
import { apiClient } from '@/lib/axios';
import Cookies from 'js-cookie';

interface User {
    _id: string;
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
            // First, attempt to login and get the token
            const loginResponse = await apiClient.post('/auth/login', { email, password });
            const { access_token } = loginResponse?.data?.data;

            if (!access_token) {
                throw new Error('No access token received');
            }

            // Set the token first so the next request includes it
            Cookies.set('token', access_token);

            // Now get the user details with the token
            const userResponse = await apiClient.get('/auth/user');
            const userData = userResponse?.data?.data;

            if (!userData) {
                throw new Error('No user data received');
            }

            // Update the store with user data
            set({ user: userData, isAuthenticated: true });
        } catch (error) {
            // Clean up if anything goes wrong
            Cookies.remove('token');
            set({ user: null, isAuthenticated: false });
            throw error;
        }
    },
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/register', { name, email, password });
            if (!response?.data?.data) {
                throw new Error('Registration failed');
            }

            // First, attempt to login and get the token
            const loginResponse = await apiClient.post('/auth/login', { email, password });
            const { access_token } = loginResponse?.data?.data;

            if (!access_token) {
                throw new Error('No access token received');
            }

            // Set the token first so the next request includes it
            Cookies.set('token', access_token);

            // Now get the user details with the token
            const userResponse = await apiClient.get('/auth/user');
            const userData = userResponse?.data?.data;

            if (!userData) {
                throw new Error('No user data received');
            }

            // Update the store with user data
            set({ user: userData, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },
    logout: () => {
        Cookies.remove('token');
        set({ user: null, isAuthenticated: false });
    },
}));
