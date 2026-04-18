import React from 'react';
import { Bell, CircleUserRound, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
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

                    <button className="p-2 rounded-md border border-[#E5E5E5] text-[#6B7280] hover:text-[#8B2E2E] hover:border-[#D1D5DB] bg-white">
                        <Bell className="w-4 h-4" />
                    </button>

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
