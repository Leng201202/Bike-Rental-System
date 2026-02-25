import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Pagination from '../../components/UI/Pagination';
import { showToast } from '../../components/UI/PremiumToast';

const DebtManagement = () => {
    const [debts, setDebts] = useState([
        { id: 1, user: 'John Doe', email: 'john@uni.edu', totalDebt: 120.00, lastRide: '2026-02-15', status: 'OVERDUE' },
        { id: 2, user: 'Jane Watson', email: 'jane@uni.edu', totalDebt: 45.50, lastRide: '2026-02-18', status: 'PENDING' },
        { id: 3, user: 'Mike Ross', email: 'mike@university.com', totalDebt: 310.00, lastRide: '2026-02-10', status: 'CRITICAL' },
        { id: 4, user: 'Sarah Connor', email: 'sarah@skynet.edu', totalDebt: 15.00, lastRide: '2026-02-19', status: 'PENDING' },
    ]);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtered & Paginated Data
    const filteredDebts = debts.filter(debt =>
        debt.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDebts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDebts = filteredDebts.slice(startIndex, startIndex + itemsPerPage);

    const handleNotify = (user) => {
        showToast.success(`Notification sent to ${user.name} via email & app.`);
        // In a real app, this would trigger a backend API call to send a notification
    };

    const stats = [
        { label: 'Total Outstanding', val: '฿490.50', variant: 'primary', icon: '💸' },
        { label: 'Overdue Users', val: '3', variant: 'secondary', icon: '🏃' },
        { label: 'Avg Debt', val: '฿122.60', variant: 'outline', icon: '📊' },
        { label: 'Notif Sents Today', val: '12', variant: 'primary', icon: '🔔' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Debt Management</h1>
                <p className="text-gray-400 font-medium">Track unpaid balances and notify users of outstanding dues.</p>
            </header>

            {/* Debt Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, i) => (
                    <Card key={i} className="group">
                        <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 group-hover:rotate-6 origin-left">
                            {s.icon}
                        </div>
                        <div className={`text-3xl font-black mb-1`}>{s.val}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
                    </Card>
                ))}
            </div>

            <section className="bg-gray-800/20 border border-gray-700/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="p-8 border-b border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-300">Delinquent Accounts</h2>
                    <input
                        type="text"
                        placeholder="Search rider name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-80 bg-black/20 border border-gray-700 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all outline-none font-medium text-white placeholder:text-gray-600"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-black/10">
                                <th className="px-8 py-6">Rider</th>
                                <th className="px-8 py-6">Total Debt</th>
                                <th className="px-8 py-6">Last Active</th>
                                <th className="px-8 py-6">Risk Level</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {paginatedDebts.map(debt => (
                                <tr key={debt.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-white">{debt.user}</div>
                                        <div className="text-[10px] text-gray-500">{debt.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-red-400">฿{debt.totalDebt.toFixed(2)}</td>
                                    <td className="px-8 py-6 text-xs font-medium text-gray-400">{debt.lastRide}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${debt.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                            debt.status === 'OVERDUE' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                            }`}>
                                            {debt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Button
                                            variant="outline"
                                            className="px-4 py-2 text-[10px] uppercase font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                            onClick={() => handleNotify(debt)}
                                        >
                                            Notify User
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {paginatedDebts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-500 font-bold uppercase tracking-widest italic">
                                        No delinquent accounts found matching your search.
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

export default DebtManagement;
