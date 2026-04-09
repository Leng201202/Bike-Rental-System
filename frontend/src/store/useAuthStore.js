import { create } from 'zustand';

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
            const userLower = (credentials.username || '').toLowerCase();
            const role = userLower.includes('admin') ? 'ADMIN' : 'RIDER';

            const mockUser = {
                username: credentials.username || 'demo_user',
                fullName: credentials.username === 'admin' ? 'System Administrator' : 'Alice Smith',
                email: credentials.username === 'admin' ? 'admin@bikerental.com' : 'alice@uni.edu',
                campusId: 'ST-48293',
                phoneNumber: credentials.phoneNumber || '+66 81-234-5678',
                role: role,
                avatar: null,
                memberSince: 'February 2026',
                debt: credentials.username === 'admin' ? 0 : 45.50 // Default mock debt for riders
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
        } catch {
            set({
                error: 'Login failed',
                loading: false
            });
            return false;
        }
    },

    updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            // Simulate API Latency
            await new Promise(resolve => setTimeout(resolve, 800));

            set(state => ({
                user: { ...state.user, ...profileData },
                loading: false
            }));
            return true;
        } catch {
            set({ error: 'Failed to update profile', loading: false });
            return false;
        }
    },

    payDebt: async (amount) => {
        set({ loading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate payment processing
            set(state => ({
                user: { ...state.user, debt: Math.max(0, state.user.debt - amount) },
                loading: false
            }));
            return true;
        } catch {
            set({ error: 'Payment failed', loading: false });
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
        } catch {
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
