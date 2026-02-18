import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="border-b border-gray-800 p-4 sticky top-0 bg-[#242424]/80 backdrop-blur-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    BikeRental
                </Link>

                <div className="flex items-center space-x-6">
                    {isAuthenticated && user?.role === 'RIDER' && (
                        <div className="flex items-center space-x-6 mr-6 transition-all animate-in fade-in slide-in-from-left-4">
                            <Link to="/rider?tab=bikes" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Browse Bikes</Link>
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
                            <span className="text-sm text-gray-400">Hi, <span className="text-white font-bold">{user?.username}</span></span>
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
            </div>
        </nav>
    );
};

export default Navbar;
