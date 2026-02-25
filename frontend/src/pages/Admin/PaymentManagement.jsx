import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import Pagination from '../../components/UI/Pagination';

const PaymentManagement = () => {
    // Mock Payments Data
    const [payments] = useState([
        { id: 'TRX-9821', user: 'Alice Smith', email: 'alice@uni.edu', amount: 145.20, date: '2026-02-19 09:45', method: 'PromptPay', status: 'COMPLETED' },
        { id: 'TRX-9822', user: 'Bob Johnson', email: 'bob@uni.edu', amount: 82.50, date: '2026-02-19 09:12', method: 'PromptPay', status: 'COMPLETED' },
        { id: 'TRX-9823', user: 'Charlie Davis', email: 'charlie@uni.edu', amount: 310.00, date: '2026-02-18 18:30', method: 'PromptPay', status: 'PENDING' },
        { id: 'TRX-9824', user: 'Diana Prince', email: 'diana@uni.edu', amount: 12.00, date: '2026-02-18 16:20', method: 'PromptPay', status: 'FAILED' },
        { id: 'TRX-9825', user: 'Edward Norton', email: 'edward@uni.edu', amount: 55.00, date: '2026-02-18 14:10', method: 'PromptPay', status: 'COMPLETED' },
    ]);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtered & Paginated Data
    const filteredPayments = payments.filter(pay =>
        pay.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    const stats = [
        { label: 'Today\'s Revenue', val: '฿227.70', variant: 'primary', icon: '📈' },
        { label: 'Pending Clearances', val: '1', variant: 'secondary', icon: '⏳' },
        { label: 'Failed Trans.', val: '1', variant: 'outline', icon: '❌' },
        { label: 'Active Methods', val: '3', variant: 'primary', icon: '💳' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Payment Management</h1>
                <p className="text-gray-400 font-medium">Verify incoming funds and manage transaction records.</p>
            </header>

            {/* Payment Stats */}
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
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-300">Transaction History</h2>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search ID or user..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="flex-1 sm:w-64 bg-black/20 border border-gray-700 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all outline-none font-medium text-white placeholder:text-gray-600"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-black/10">
                                <th className="px-8 py-6">Transaction ID</th>
                                <th className="px-8 py-6">User</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Method</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {paginatedPayments.map(pay => (
                                <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6 font-mono text-xs text-blue-400 font-bold">{pay.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-white">{pay.user}</div>
                                        <div className="text-[10px] text-gray-500">{pay.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-white">฿{pay.amount.toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                                            {pay.method}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-medium text-gray-400">{pay.date}</td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={pay.status} />
                                    </td>
                                </tr>
                            ))}

                            {paginatedPayments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-gray-500 font-bold uppercase tracking-widest italic">
                                        No transactions found matching your search.
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

export default PaymentManagement;
