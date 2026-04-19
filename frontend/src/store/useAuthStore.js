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
            const identifier = credentials.identifier || credentials.username || credentials.email || '';
            const normalizedStudentId = String(credentials.studentId || identifier || '').trim();
            const userLower = identifier.toLowerCase();
            const role = userLower.includes('admin') ? 'ADMIN' : 'RIDER';

            let user;
            if (role === 'ADMIN') {
                user = buildDisplayUser(null, {
                    username: deriveUsernameFromIdentifier(identifier) || 'admin',
                    fullName: 'System Administrator',
                    email: identifier.includes('@') ? identifier : 'admin@bikerental.com',
                    role: 'ADMIN',
                    debt: 0,
                });
            } else {
                const resolvedEmail = identifier.includes('@')
                    ? identifier.toLowerCase()
                    : `${deriveUsernameFromIdentifier(normalizedStudentId)}@uni.edu`;

                const payload = {
                    username: deriveUsernameFromIdentifier(normalizedStudentId),
                    fullName: credentials.fullName || deriveUsernameFromIdentifier(identifier) || 'Campus Rider',
                    email: resolvedEmail,
                    phoneNumber: credentials.phoneNumber || '+66 81-234-5678',
                    student_id: normalizedStudentId || credentials.campusId || '',
                };
                const backendUser = unwrapApiResponse(await api.post('/users/sync', payload));
                user = buildDisplayUser(backendUser, { role: 'RIDER' });
            }

            const mockToken = `mock-jwt-token-${role}`;

            localStorage.setItem('token', mockToken);
            localStorage.setItem('auth_user', JSON.stringify(user));
            set({
                user,
                token: mockToken,
                isAuthenticated: true,
                loading: false
            });

            useNotificationStore.getState().notify({
                title: 'Welcome Back',
                message: role === 'ADMIN' ? 'Admin session is ready.' : 'Your rider account is now active.',
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
                fullName: userData.fullName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                student_id: userData.studentId,
            };
            unwrapApiResponse(await api.post('/users/sync', payload));
            set({ loading: false });
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
