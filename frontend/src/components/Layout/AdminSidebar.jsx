import React from 'react';
import {
    Bike,
    ClipboardList,
    CreditCard,
    Gauge,
    LogOut,
    MapPin,
    Shield,
    UserRound,
    UsersRound
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'fleet', label: 'Bike Inventory', icon: Bike },
        { id: 'tracking', label: 'Live Tracking', icon: MapPin },
        { id: 'users', label: 'User Management', icon: UsersRound },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'debt', label: 'Debt Ledger', icon: Gauge },
        { id: 'logs', label: 'Audit Logs', icon: ClipboardList },
        { id: 'profile', label: 'Admin Profile', icon: UserRound },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="w-72 bg-white border-r border-[#E5E5E5] flex flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar">
            <div className="px-6 py-5 bg-[#8B2E2E] border-b border-[#7A2626]">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-[#FDE8E8] uppercase mb-1">Mae Fah Luang University</div>
                <div className="text-base font-semibold text-white">Bike Rental Administration</div>
            </div>

            <div className="p-6">

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors relative ${activeTab === item.id
                                ? 'bg-[#FCEAEA] text-[#8B2E2E]'
                                : 'text-[#4B5563] hover:text-[#8B2E2E] hover:bg-[#F9FAFB]'
                                }`}
                        >
                            {activeTab === item.id && (
                                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#8B2E2E]" />
                            )}
                            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#8B2E2E]' : 'text-[#6B7280]'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-md bg-[#FCEAEA] border border-[#F2CACA] text-[#8B2E2E] font-semibold flex items-center justify-center">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-[#2F2F2F]">{user?.username}</div>
                        <div className="text-xs text-[#6B7280] flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            Administrator
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-[#8B2E2E] border border-[#8B2E2E] hover:bg-[#FCEAEA] transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
