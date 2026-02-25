import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'fleet', label: 'Bike Management', icon: '🚲' },
        { id: 'tracking', label: 'Live Tracking', icon: '📍' },
        { id: 'users', label: 'User Management', icon: '👥' },
        { id: 'payments', label: 'Payments', icon: '💰' },
        { id: 'debt', label: 'Debt Management', icon: '💸' },
        { id: 'logs', label: 'Audit Logs', icon: '📋' },
        { id: 'profile', label: 'Admin Profile', icon: '👤' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="w-72 bg-gray-900/50 backdrop-blur-2xl border-r border-gray-800 flex flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar">
            <div className="p-8">
                <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-10">
                    BikeAdmin
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-gray-800/50">
                <div className="flex items-center gap-4 mb-6 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">{user?.username}</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Administrator</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all"
                >
                    <span className="text-xl">🚪</span>
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
