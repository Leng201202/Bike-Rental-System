import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import Pagination from '../../components/UI/Pagination';

const UserManagement = () => {
    // Mock Users Data
    const users = [
        {
            id: 1,
            name: 'Alice Smith',
            email: 'alice@uni.edu',
            activeRentals: ['Electric Spark S5'],
            rentalType: 'PER_KM',
            startTime: '2026-02-19 08:30:15',
            totalSpend: 145.20,
            status: 'Active'
        },
        {
            id: 2,
            name: 'Bob Johnson',
            email: 'bob@uni.edu',
            activeRentals: [],
            rentalType: null,
            startTime: null,
            totalSpend: 82.50,
            status: 'Inactive'
        },
        {
            id: 3,
            name: 'Charlie Davis',
            email: 'charlie@uni.edu',
            activeRentals: ['City Cruiser v2'],
            rentalType: 'PER_HOUR',
            startTime: '2026-02-19 09:15:00',
            totalSpend: 310.00,
            status: 'Active'
        },
        {
            id: 4,
            name: 'Diana Prince',
            email: 'diana@uni.edu',
            activeRentals: [],
            rentalType: null,
            startTime: null,
            totalSpend: 12.00,
            status: 'Active'
        },
    ];

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtered & Paginated Data
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">User Management</h1>
                <p className="text-gray-400 font-medium">Monitor active riders and rental status across campus.</p>
            </header>

            <section className="bg-gray-800/20 border border-gray-700/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="p-8 border-b border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-300">Rider Directory</h2>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-auto bg-black/20 border border-gray-700 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-gray-600 font-medium text-white"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-black/10">
                                <th className="px-8 py-6">User</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Active Rentals</th>
                                <th className="px-8 py-6">Rental Type</th>
                                <th className="px-8 py-6">Start Time</th>
                                <th className="px-8 py-6 text-right">Total Contribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="font-bold text-white mb-0.5">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user.status === 'Active'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.activeRentals.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.activeRentals.map((bike, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                                                        {bike}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-xs italic">No active rentals</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.rentalType ? (
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.rentalType === 'PER_KM' ? 'text-indigo-400' : 'text-amber-400'}`}>
                                                {user.rentalType === 'PER_KM' ? 'Distance (฿/KM)' : 'Hourly (฿/HR)'}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 text-[10px] font-black">---</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-gray-400">
                                            {user.startTime ? user.startTime : <span className="text-gray-600">---</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-white">฿{user.totalSpend.toLocaleString()}</td>
                                </tr>
                            ))}

                            {paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-gray-500 font-bold uppercase tracking-widest italic">
                                        No users found matching your search.
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
};

export default UserManagement;
