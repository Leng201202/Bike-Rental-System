import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CircleUserRound, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { notifications, browserPermission, requestPermission, refreshPermission, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const panelRef = useRef(null);

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    useEffect(() => {
        refreshPermission();
    }, [refreshPermission]);

    useEffect(() => {
        if (!isNotificationOpen) return;

        const onDocumentClick = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', onDocumentClick);
        return () => document.removeEventListener('mousedown', onDocumentClick);
    }, [isNotificationOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleToggleNotifications = () => {
        const nextOpen = !isNotificationOpen;
        setIsNotificationOpen(nextOpen);
        if (nextOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    const formatTime = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleString();
    };

    if (isAuthenticated && user?.role === 'ADMIN' && location.pathname.startsWith('/admin')) {
        return null;
    }

    const pageTitle = (() => {
        if (location.pathname.startsWith('/rider')) return 'Bike Rental Services';
        if (location.pathname.startsWith('/map')) return 'Live Tracking';
        if (location.pathname.startsWith('/payment')) return 'Payment and Receipt';
        if (location.pathname.startsWith('/login')) return 'User Login';
        if (location.pathname.startsWith('/register')) return 'User Registration';
        return 'MFU Bike Rental Administration';
    })();

    return (
        <nav className="border-b border-[#E5E5E5] py-3 px-4 sticky top-0 bg-white z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-md bg-[#8B2E2E] text-white text-xs font-semibold flex items-center justify-center">
                            MFU
                        </span>
                        <span className="text-sm font-semibold text-[#8B2E2E]">Bike Rental System</span>
                    </Link>
                    <div className="hidden md:block h-8 w-px bg-[#E5E5E5]" />
                    <p className="hidden md:block text-sm font-medium text-[#2F2F2F] truncate">{pageTitle}</p>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    {isAuthenticated && user?.role === 'RIDER' && (
                        <div className="hidden lg:flex items-center space-x-4">
                            <Link to="/rider?tab=bikes" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors">Bikes</Link>
                            <Link to="/map" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors">Map</Link>
                            <Link to="/rider?tab=manage" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors">Rentals</Link>
                            <Link to="/rider?tab=history" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors">History</Link>
                            <Link to="/rider?tab=profile" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors">Profile</Link>
                        </div>
                    )}

                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <div className="hidden lg:flex items-center space-x-4">
                            <Link to="/admin" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4" />
                                Admin Panel
                            </Link>
                        </div>
                    )}

                    <div className="relative" ref={panelRef}>
                        <button
                            onClick={handleToggleNotifications}
                            className="relative p-2 rounded-md border border-[#E5E5E5] text-[#6B7280] hover:text-[#8B2E2E] hover:border-[#D1D5DB] bg-white"
                            aria-label="Open notifications"
                        >
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B2E2E] text-white text-[10px] font-semibold flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-[60]">
                                <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm font-semibold text-[#2F2F2F]">Notifications</h4>
                                        <p className="text-xs text-[#6B7280]">
                                            {browserPermission === 'granted'
                                                ? 'Browser notifications enabled'
                                                : browserPermission === 'denied'
                                                    ? 'Browser notifications blocked'
                                                    : browserPermission === 'unsupported'
                                                        ? 'Browser notifications not supported'
                                                        : 'Enable browser notifications for alerts'}
                                        </p>
                                    </div>
                                    {browserPermission === 'default' && (
                                        <button
                                            onClick={requestPermission}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#8B2E2E] hover:bg-[#6F2323] rounded-md"
                                        >
                                            Enable
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-[#6B7280]">
                                            No notifications yet.
                                        </div>
                                    ) : (
                                        notifications.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => markAsRead(item.id)}
                                                className={`w-full text-left px-4 py-3 border-b border-[#F3F4F6] hover:bg-[#FAFAFA] ${!item.read ? 'bg-[#FFF7F7]' : ''}`}
                                            >
                                                <div className="text-sm font-semibold text-[#2F2F2F]">{item.title}</div>
                                                <div className="text-xs text-[#6B7280] mt-1">{item.message}</div>
                                                <div className="text-[11px] text-[#9CA3AF] mt-1">{formatTime(item.createdAt)}</div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <div className="px-4 py-2 flex justify-end border-t border-[#E5E7EB]">
                                        <button
                                            onClick={clearAll}
                                            className="text-xs font-medium text-[#8B2E2E] hover:text-[#6F2323]"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 border-l border-[#E5E5E5] pl-3">
                            <div className="hidden md:flex items-center gap-2 text-sm text-[#6B7280]">
                                <CircleUserRound className="w-4 h-4" />
                                <span className="font-medium text-[#2F2F2F]">{user?.fullName?.split(' ')[0] || user?.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 bg-white hover:bg-[#F7F7F7] text-[#8B2E2E] rounded-md text-sm font-medium border border-[#8B2E2E] transition-colors flex items-center gap-1.5"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#8B2E2E] transition-colors">Log In</Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-[#8B2E2E] hover:bg-[#6F2323] text-white rounded-md text-sm font-medium border border-[#8B2E2E] transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
