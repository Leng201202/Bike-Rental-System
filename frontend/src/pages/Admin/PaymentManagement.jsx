import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import Pagination from '../../components/UI/Pagination';
import api, { unwrapApiResponse } from '../../api/api';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const [paymentRes, userRes] = await Promise.all([
                    api.get('/payments'),
                    api.get('/users'),
                ]);

                const paymentData = unwrapApiResponse(paymentRes) || [];
                const users = unwrapApiResponse(userRes) || [];
                const userMap = new Map(users.map((user) => [user.id, user]));

                const mapped = paymentData.map((payment) => {
                    const user = userMap.get(payment.userId);
                    return {
                        id: payment.transactionCode || `TXN-${payment.id}`,
                        user: user?.fullName || user?.username || `User #${payment.userId}`,
                        email: user?.email || '-',
                        amount: Number(payment.amount || 0),
                        date: payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '-',
                        paidAt: payment.paidAt || null,
                        method: payment.method || 'PROMPTPAY',
                        status: payment.status || 'COMPLETED',
                    };
                });

                if (mounted) {
                    setPayments(mapped);
                    setLoadingData(false);
                }
            } catch {
                if (mounted) {
                    setPayments([]);
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
    const filteredPayments = payments.filter(pay =>
        pay.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    const stats = useMemo(() => {
        const todayKey = new Date().toDateString();
        const todayRevenue = payments
            .filter((item) => item.status === 'COMPLETED' && item.paidAt && new Date(item.paidAt).toDateString() === todayKey)
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const pending = payments.filter((item) => item.status === 'PENDING').length;
        const failed = payments.filter((item) => item.status === 'FAILED').length;
        const methodCount = new Set(payments.map((item) => item.method)).size;

        return [
            { label: 'Today\'s Revenue', val: `฿${todayRevenue.toFixed(2)}`, icon: '📈' },
            { label: 'Pending Clearances', val: String(pending), icon: '⏳' },
            { label: 'Failed Trans.', val: String(failed), icon: '❌' },
            { label: 'Active Methods', val: String(methodCount), icon: '💳' },
        ];
    }, [payments]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">Payment Management</h1>
                <p className="text-[#6B7280] font-medium">Verify incoming funds and manage transaction records.</p>
            </header>

            {/* Payment Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, i) => (
                    <Card key={i} className="group">
                        <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 group-hover:rotate-6 origin-left">
                            {s.icon}
                        </div>
                        <div className="text-3xl font-semibold mb-1 text-[#2F2F2F]">{s.val}</div>
                        <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">{s.label}</div>
                    </Card>
                ))}
            </div>

            <section className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-semibold tracking-wide text-[#8B2E2E]">Transaction History</h2>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search ID or user..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="flex-1 sm:w-64 bg-white border border-[#D1D5DB] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B2E2E] transition-all font-medium text-[#2F2F2F] placeholder:text-[#9CA3AF]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280] bg-[#F9FAFB]">
                                <th className="px-8 py-6">Transaction ID</th>
                                <th className="px-8 py-6">User</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Method</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {loadingData && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-[#6B7280] font-medium italic">
                                        Loading transactions...
                                    </td>
                                </tr>
                            )}

                            {paginatedPayments.map(pay => (
                                <tr key={pay.id} className="hover:bg-[#FCFCFC] transition-colors group">
                                    <td className="px-8 py-6 font-mono text-xs text-[#8B2E2E] font-semibold">{pay.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-semibold text-[#2F2F2F]">{pay.user}</div>
                                        <div className="text-[11px] text-[#6B7280]">{pay.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-semibold text-[#2F2F2F]">฿{pay.amount.toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-medium uppercase tracking-wide text-[#6B7280] italic">
                                            {pay.method}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-medium text-[#6B7280]">{pay.date}</td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={pay.status} />
                                    </td>
                                </tr>
                            ))}

                            {!loadingData && paginatedPayments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-[#6B7280] font-medium italic">
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
