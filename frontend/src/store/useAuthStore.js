import { create } from 'zustand';
import api, { getApiErrorMessage, unwrapApiResponse } from '../api/api';
import useNotificationStore from './useNotificationStore';

const buildDisplayUser = (backendUser, fallback = {}) => ({
    id: backendUser?.id,
    username: backendUser?.username || fallback.username || 'demo_user',
    fullName: backendUser?.fullName || fallback.fullName || 'Rider User',
    email: backendUser?.email || fallback.email || 'rider@uni.edu',
    studentId: backendUser?.student_id || backendUser?.studentId || backendUser?.campusId || fallback.studentId || '',
    phoneNumber: backendUser?.phoneNumber || fallback.phoneNumber || '+66 81-234-5678',
    role: backendUser?.role || fallback.role || 'RIDER',
    avatar: null,
    memberSince: 'February 2026',
    debt: 0,
});

const deriveUsernameFromIdentifier = (identifier = '') => {
    const raw = String(identifier || '').trim().toLowerCase();
    if (!raw) return `rider_${Date.now()}`;
    if (raw.includes('@')) return raw.split('@')[0].replace(/[^a-z0-9._-]/g, '') || `rider_${Date.now()}`;
    return raw.replace(/[^a-z0-9._-]/g, '') || `rider_${Date.now()}`;
};

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('auth_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const useAuthStore = create((set) => ({
    user: getStoredUser(),
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
            const auth = unwrapApiResponse(
                await api.post('/auth/login', {
                    identifier: credentials.identifier || credentials.username || credentials.email,
                    password: credentials.password,
                })
            );

            const user = buildDisplayUser(auth?.user);
            const token = auth?.token;
            if (!token) {
                throw new Error('Login failed: token was not returned');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            set({
                user,
                token,
                isAuthenticated: true,
                loading: false
            });

            useNotificationStore.getState().notify({
                title: 'Welcome Back',
                message: user.role === 'ADMIN' ? 'Admin session is ready.' : 'Your rider account is now active.',
                level: 'info',
            });
            return true;
        } catch (error) {
            set({
                error: getApiErrorMessage(error, 'Login failed'),
                loading: false
            });
            return false;
        }
    },

    updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            set(state => {
                const currentStudentId = state.user?.studentId;
                const incomingStudentId = String(
                    profileData?.studentId ?? profileData?.student_id ?? ''
                ).trim();
                const resolvedStudentId = currentStudentId || incomingStudentId;

                const updatedUser = {
                    ...state.user,
                    ...profileData,
                    studentId: resolvedStudentId,
                };
                localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                return {
                    user: updatedUser,
                    loading: false,
                };
            });
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

            useNotificationStore.getState().notify({
                title: 'Debt Payment Confirmed',
                message: 'Your outstanding debt has been updated successfully.',
                level: 'success',
            });
            return true;
        } catch {
            set({ error: 'Payment failed', loading: false });
            return false;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                username: deriveUsernameFromIdentifier(userData.studentId || userData.email),
                fullName: userData.fullName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                student_id: userData.studentId,
                password: userData.password,
            };
            const auth = unwrapApiResponse(await api.post('/auth/register', payload));
            const user = buildDisplayUser(auth?.user);
            const token = auth?.token;

            if (!token) {
                throw new Error('Registration failed: token was not returned');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            set({
                loading: false,
                user,
                token,
                isAuthenticated: true,
            });
            return true;
        } catch (error) {
            set({
                error: getApiErrorMessage(error, 'Registration failed'),
                loading: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('hasAgreedToTerms');
        localStorage.removeItem('auth_user');
        set({ user: null, token: null, isAuthenticated: false, hasAgreedToTerms: false });
    },

    setUser: (user) => set({ user }),

    hasCompletedStudentId: () => {
        const user = useAuthStore.getState().user;
        return Boolean(user?.studentId && String(user.studentId).trim());
    },
}));

export default useAuthStore;
