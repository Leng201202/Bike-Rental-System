import React from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isAuthenticated && user?.role === 'ADMIN' && location.pathname.startsWith('/admin')) {
        return null;
    }

    const isRider = isAuthenticated && user?.role === 'RIDER';

    // Determine active tab for bottom bar highlighting
    const currentTab = searchParams.get('tab');
    const isActive = (path, tab = null) => {
        if (tab) return location.pathname === '/rider' && currentTab === tab;
        return location.pathname === path;
    };

    // Tab items for bottom bar
    const riderTabs = [
        {
            to: '/rider?tab=bikes', tab: 'bikes', label: 'Bikes',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6l-4 8h-3m6-8h4l2 4m-6 4l-2-4m-3 0l-2-4h3" />
                </svg>
            ),
        },
        {
            to: '/map', path: '/map', label: 'Map', hasLive: true,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                </svg>
            ),
        },
        {
            to: '/rider?tab=manage', tab: 'manage', label: 'Rentals',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    <path d="M9 14l2 2 4-4" />
                </svg>
            ),
        },
        {
            to: '/rider?tab=history', tab: 'history', label: 'History',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
            ),
        },
        {
            to: '/rider?tab=profile', tab: 'profile', label: 'Profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Top Navbar */}
            <nav className="border-b border-gray-800 p-4 sticky top-0 bg-[#242424]/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        BikeRental
                    </Link>

                    {/* Desktop Navigation — unchanged */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isRider && (
                            <div className="flex items-center space-x-6 mr-6 transition-all animate-in fade-in slide-in-from-left-4">
                                <Link to="/rider?tab=bikes" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Browse Bikes</Link>
                                <Link to="/map" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                    Map
                                </Link>
                                <Link to="/rider?tab=manage" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Rentals</Link>
                                <Link to="/rider?tab=history" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">History</Link>
                                <Link to="/rider?tab=profile" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Profile</Link>
                            </div>
                        )}

                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <div className="flex items-center space-x-6 mr-6 transition-all animate-in fade-in slide-in-from-left-4">
                                <Link to="/admin" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Admin Panel</Link>
                            </div>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4 border-l border-gray-700 pl-6">
                                <span className="text-sm text-gray-400">Hi, <span className="text-white font-bold">{user?.fullName?.split(' ')[0] || user?.username}</span></span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition-all"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">Log In</Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Auth actions only (no hamburger needed anymore) */}
                    <div className="flex md:hidden items-center space-x-3">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                Log Out
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="text-xs font-medium text-gray-400 hover:text-blue-400 transition-colors">Log In</Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar — only visible for authenticated riders on mobile */}
            {isRider && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
                    <div className="flex justify-around items-center h-16">
                        {riderTabs.map((item) => {
                            const active = item.tab ? isActive('/rider', item.tab) : isActive(item.path);
                            return (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative ${
                                        active ? 'text-blue-400' : 'text-gray-500 active:text-gray-300'
                                    }`}
                                >
                                    {/* Active indicator bar */}
                                    {active && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full" />
                                    )}
                                    <div className="relative">
                                        {item.icon}
                                        {item.hasLive && (
                                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold ${active ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;

