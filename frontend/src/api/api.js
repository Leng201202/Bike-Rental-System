import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token if needed
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

export const unwrapApiResponse = (response) => {
    const payload = response?.data;
    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'success')) {
        if (!payload.success) {
            const message = payload.error?.message || 'Request failed';
            throw new Error(message);
        }
        return payload.data;
    }
    return payload;
};

export const getApiErrorMessage = (error, fallback = 'Request failed') => {
    return error?.response?.data?.error?.message || error?.message || fallback;
};
