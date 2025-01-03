import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    },
);
