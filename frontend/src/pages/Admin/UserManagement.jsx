import React, { useEffect, useMemo, useState } from 'react';
import Pagination from '../../components/UI/Pagination';
import api, { unwrapApiResponse } from '../../api/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const [userRes, rentalRes, paymentRes, bikeRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/rentals'),
                    api.get('/payments'),
                    api.get('/bikes'),
                ]);

                const userData = (unwrapApiResponse(userRes) || []).filter((item) => item.role === 'RIDER');
                const rentals = unwrapApiResponse(rentalRes) || [];
                const payments = unwrapApiResponse(paymentRes) || [];
                const bikes = unwrapApiResponse(bikeRes) || [];
                const bikeMap = new Map(bikes.map((bike) => [bike.id, bike]));

                const mappedUsers = userData.map((user) => {
                    const activeRentals = rentals.filter(
                        (rental) => rental.userId === user.id && (rental.status === 'ACTIVE' || rental.status === 'RESERVED')
                    );

                    const completedPayments = payments.filter(
                        (payment) => payment.userId === user.id && payment.status === 'COMPLETED'
                    );

                    const totalSpend = completedPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
                    const firstActiveRental = activeRentals[0] || null;

                    return {
                        id: user.id,
                        name: user.fullName || user.username || `User #${user.id}`,
                        email: user.email || '-',
                        activeRentals: activeRentals.map((rental) => bikeMap.get(rental.bikeId)?.name || `Bike #${rental.bikeId}`),
                        rentalType: firstActiveRental?.method || null,
                        startTime: firstActiveRental?.startedAt ? new Date(firstActiveRental.startedAt).toLocaleString() : null,
                        totalSpend,
                        status: activeRentals.length > 0 ? 'Active' : (user.is_active ? 'Inactive' : 'Disabled'),
                    };
                });

                if (mounted) {
                    setUsers(mappedUsers);
                    setLoadingData(false);
                }
            } catch {
                if (mounted) {
                    setUsers([]);
                    setLoadingData(false);
                }
            }
        };

        loadData();
        return () => {
            mounted = false;
        };
    }, []);

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
                <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">User Management</h1>
                <p className="text-[#6B7280] font-medium">Monitor active riders and rental status across campus.</p>
            </header>

            <section className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-semibold tracking-wide text-[#8B2E2E]">Rider Directory</h2>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-auto bg-white border border-[#D1D5DB] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B2E2E] focus:ring-2 focus:ring-[#8B2E2E]/15 transition-all placeholder:text-[#9CA3AF] font-medium text-[#2F2F2F]"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280] bg-[#F9FAFB]">
                                <th className="px-8 py-6">User</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Active Rentals</th>
                                <th className="px-8 py-6">Rental Type</th>
                                <th className="px-8 py-6">Start Time</th>
                                <th className="px-8 py-6 text-right">Total Contribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {loadingData && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-[#6B7280] font-medium italic">
                                        Loading rider directory...
                                    </td>
                                </tr>
                            )}

                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-[#FCFCFC] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="font-semibold text-[#2F2F2F] mb-0.5">{user.name}</div>
                                            <div className="text-xs text-[#6B7280]">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border transition-all ${user.status === 'Active'
                                            ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]'
                                            : 'bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.activeRentals.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.activeRentals.map((bike, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-[#FCEAEA] border border-[#F2CACA] text-[#8B2E2E] text-[10px] font-semibold rounded-md tracking-tight">
                                                        {bike}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[#6B7280] text-xs italic">No active rentals</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.rentalType ? (
                                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${user.rentalType === 'MILEAGE' ? 'text-[#8B2E2E]' : 'text-[#92400E]'}`}>
                                                {user.rentalType === 'MILEAGE' ? 'Distance (฿/KM)' : 'Hourly (฿/HR)'}
                                            </span>
                                        ) : (
                                            <span className="text-[#9CA3AF] text-[10px] font-semibold">---</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-medium text-[#6B7280]">
                                            {user.startTime ? user.startTime : <span className="text-[#9CA3AF]">---</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-semibold text-[#2F2F2F]">฿{user.totalSpend.toLocaleString()}</td>
                                </tr>
                            ))}

                            {!loadingData && paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-[#6B7280] font-medium italic">
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
