import { create } from 'zustand';

const STORAGE_KEY = 'app_notifications_v1';
const MAX_NOTIFICATIONS = 30;

const getBrowserPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
};

const readStoredNotifications = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const persistNotifications = (notifications) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
        // Ignore storage failures so notifications do not break UX.
    }
};

const maybeShowBrowserNotification = (title, message) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
        new Notification(title, {
            body: message,
            icon: '/favicon.ico',
        });
    } catch {
        // Ignore browser-level notification errors.
    }
};

const useNotificationStore = create((set, get) => ({
    notifications: readStoredNotifications(),
    browserPermission: getBrowserPermission(),

    requestPermission: async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            set({ browserPermission: 'unsupported' });
            return 'unsupported';
        }

        const permission = await Notification.requestPermission();
        set({ browserPermission: permission });
        return permission;
    },

    refreshPermission: () => {
        set({ browserPermission: getBrowserPermission() });
    },

    notify: ({ title, message, level = 'info', sendBrowser = true }) => {
        const nextNotification = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            title,
            message,
            level,
            read: false,
            createdAt: new Date().toISOString(),
        };

        const nextNotifications = [nextNotification, ...get().notifications].slice(0, MAX_NOTIFICATIONS);
        persistNotifications(nextNotifications);
        set({ notifications: nextNotifications });

        if (sendBrowser) {
            maybeShowBrowserNotification(title, message);
        }

        return nextNotification;
    },

    markAllAsRead: () => {
        const nextNotifications = get().notifications.map((item) => ({ ...item, read: true }));
        persistNotifications(nextNotifications);
        set({ notifications: nextNotifications });
    },

    markAsRead: (id) => {
        const nextNotifications = get().notifications.map((item) => (
            item.id === id ? { ...item, read: true } : item
        ));
        persistNotifications(nextNotifications);
        set({ notifications: nextNotifications });
    },

    clearAll: () => {
        persistNotifications([]);
        set({ notifications: [] });
    },
}));

export default useNotificationStore;
