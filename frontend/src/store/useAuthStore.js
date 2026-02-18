import { create } from 'zustand';
import api from '../api/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    hasAgreedToTerms: localStorage.getItem('hasAgreedToTerms') === 'true',
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    setAgreedToTerms: (status) => {
        localStorage.setItem('hasAgreedToTerms', status);
        set({ hasAgreedToTerms: status });
    },

    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            // Mock Login Logic for Testing
            // Differentiate role based on username for easy testing
            const userLower = (credentials.username || '').toLowerCase();
            const role = userLower.includes('admin') ? 'ADMIN' : 'RIDER';

            const mockUser = {
                username: credentials.username || 'demo_user',
                role: role
            };
            const mockToken = `mock-jwt-token-${role}`;

            localStorage.setItem('token', mockToken);
            set({
                user: mockUser,
                token: mockToken,
                isAuthenticated: true,
                loading: false
            });
            return true;
        } catch (error) {
            set({
                error: 'Login failed',
                loading: false
            });
            return false;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            // Mock Registration for Testing
            console.log('Registering user in mock mode:', userData);
            set({ loading: false });
            return true;
        } catch (error) {
            set({
                error: 'Registration failed',
                loading: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('hasAgreedToTerms');
        set({ user: null, token: null, isAuthenticated: false, hasAgreedToTerms: false });
    },

    setUser: (user) => set({ user }),
}));

export default useAuthStore;
