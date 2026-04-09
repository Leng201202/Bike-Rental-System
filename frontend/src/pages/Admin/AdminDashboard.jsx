import React, { useState } from 'react';
import useBikeStore from '../../store/useBikeStore';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';
import Card from '../../components/UI/Card';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import { showToast } from '../../components/UI/toast';
import SafeBikeImage from '../../components/UI/SafeBikeImage';

// Sub-view Imports
import BikeModal from '../../components/Bikes/BikeModal';
import Pagination from '../../components/UI/Pagination';
import AuditLogs from './AuditLogs';
import AdminProfile from './AdminProfile';
import PaymentManagement from './PaymentManagement';
import DebtManagement from './DebtManagement';
import LiveTracking from './LiveTracking';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
    const { bikes, addBike, updateBike, deleteBike, loading } = useBikeStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('fleet');

    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBike, setEditingBike] = useState(null);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtered & Paginated Data
    const filteredBikes = bikes.filter(bike =>
        bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.id.toString().includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBikes = filteredBikes.slice(startIndex, startIndex + itemsPerPage);

    const handleAddClick = () => {
        setEditingBike(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (bike) => {
        setEditingBike(bike);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to retire this bike from the fleet?")) {
            const success = await deleteBike(id);
            if (success) {
                showToast.success("Bike removed successfully");
            } else {
                showToast.error("Failed to remove bike");
            }
        }
    };

    const handleSaveBike = async (bikeData) => {
        let success;
        if (editingBike) {
            success = await updateBike(editingBike.id, bikeData);
            if (success) showToast.success(`${bikeData.name} updated successfully`);
        } else {
            success = await addBike(bikeData);
            if (success) showToast.success(`${bikeData.name} registered successfully`);
        }

        if (success) {
            setIsModalOpen(false);
        } else {
            showToast.error("Operation failed. Please try again.");
        }
    };

    const stats = [
        { label: 'Total Fleet', val: bikes.length, variant: 'primary', icon: '🚲' },
        { label: 'Active Rentals', val: bikes.filter(b => b.status === 'RENTED').length, variant: 'secondary', icon: '🔑' },
        { label: 'Maintenance', val: bikes.filter(b => b.status === 'MAINTENANCE').length, variant: 'outline', icon: '🔧' },
        { label: 'Total Revenue', val: '฿75,400', variant: 'primary', icon: '💰' },
    ];

    const renderFleetManagement = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight leading-none">Bike Management</h1>
                    <p className="text-gray-400 font-medium ml-1">Global fleet oversight and status control.</p>
                </div>
                <Button
                    variant="primary"
                    className="px-8 uppercase tracking-widest text-xs"
                    onClick={handleAddClick}
                >
                    Add New Bike
                </Button>
            </header>

            {/* Top Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, i) => (
                    <Card key={i} className="group">
                        <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 group-hover:rotate-6 origin-left">
                            {s.icon}
                        </div>
                        <div className={`text-4xl font-black mb-2`}>{s.val}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
                    </Card>
                ))}
            </div>

            {/* Fleet Table Section */}
            <section className="bg-gray-800/20 border border-gray-700/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="p-8 border-b border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-300">Fleet Inventory</h2>
                    <input
                        type="text"
                        placeholder="Search bike ID or name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="w-full sm:w-auto bg-black/20 border border-gray-700 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-gray-600"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-black/10">
                                <th className="px-8 py-6">ID</th>
                                <th className="px-8 py-6">Bike Detail</th>
                                <th className="px-8 py-6">Type</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-gray-400">Rate (฿/hr)</th>
                                <th className="px-8 py-6 text-gray-400">Rate (฿/km)</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {paginatedBikes.map(bike => (
                                <tr key={bike.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6 text-sm font-bold text-gray-500 group-hover:text-gray-400">
                                        #{bike.id.toString().padStart(3, '0')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-700 border border-white/5 transform group-hover:scale-105 transition-transform">
                                                <SafeBikeImage bike={bike} alt={bike.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight">{bike.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-black tracking-widest text-gray-400 group-hover:text-blue-400/80 transition-colors">{bike.type}</td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={bike.status} />
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-gray-300">
                                        <span className="text-white">฿{bike.pricePerHour}</span>/hr
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-gray-300">
                                        <span className="text-white">฿{bike.pricePerKm || '2.0'}</span>/km
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEditClick(bike)}
                                                className="p-3 hover:bg-blue-500/10 rounded-xl text-blue-400 hover:text-blue-300 transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(bike.id)}
                                                className="p-3 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedBikes.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-8 py-12 text-center text-gray-500 font-bold uppercase tracking-widest italic">
                                        No bikes found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </section>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'fleet': return renderFleetManagement();
            case 'tracking': return <LiveTracking />;
            case 'users': return <UserManagement />;
            case 'payments': return <PaymentManagement />;
            case 'debt': return <DebtManagement />;
            case 'logs': return <AuditLogs />;
            case 'profile': return <AdminProfile user={user} />;
            default: return renderFleetManagement();
        }
    };

    return (
        <div className="flex bg-[#1a1a1a] min-h-screen">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-12 overflow-y-auto h-screen no-scrollbar">
                {renderContent()}
            </main>

            <BikeModal
                key={`${isModalOpen ? 'open' : 'closed'}-${editingBike?.id ?? 'new'}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveBike}
                bike={editingBike}
                loading={loading}
            />
        </div>
    );
};

export default AdminDashboard;
