import axios from 'axios';

const resolveBaseURL = () => {
    const configured = String(import.meta.env.VITE_API_BASE_URL || '').trim();

    if (typeof window !== 'undefined') {
        const runningOnRender = window.location.hostname.endsWith('.onrender.com');
        // In production Render deployments, force same-origin API calls to avoid
        // cross-origin redirects and dropped Authorization headers.
        if (runningOnRender) {
            return '/api';
        }
    }

    if (configured) {
        return configured;
    }

    if (typeof window !== 'undefined') {
        return '/api';
    }

    return 'http://localhost:8080/api';
};

const api = axios.create({
    baseURL: resolveBaseURL(),
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

// Clear stale session state when backend rejects an expired/unknown token.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = String(error?.config?.url || '');
        const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
        const hasToken = !!localStorage.getItem('token');

        if (status === 401 && hasToken && !isAuthEndpoint) {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('hasAgreedToTerms');

            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.assign('/login');
            }
        }

        return Promise.reject(error);
    }
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
