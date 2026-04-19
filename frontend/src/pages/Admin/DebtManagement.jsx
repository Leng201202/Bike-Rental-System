import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Pagination from '../../components/UI/Pagination';
import { showToast } from '../../components/UI/toast';
import api, { unwrapApiResponse } from '../../api/api';

const DebtManagement = () => {
    const [debts, setDebts] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [notifyingId, setNotifyingId] = useState(null);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const [userRes, balanceRes, rentalRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/payments/balances'),
                    api.get('/rentals'),
                ]);

                const users = (unwrapApiResponse(userRes) || []).filter((item) => item.role === 'RIDER');
                const balances = unwrapApiResponse(balanceRes) || [];
                const rentals = unwrapApiResponse(rentalRes) || [];
                const userMap = new Map(users.map((user) => [user.id, user]));

                const mappedDebts = balances
                    .map((entry, idx) => {
                        const amount = Number(entry.outstandingBalance || 0);
                        const user = userMap.get(entry.userId);
                        if (!user || amount <= 0) return null;

                        const userRentals = rentals
                            .filter((rental) => rental.userId === user.id)
                            .sort((a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0));
                        const lastRide = userRentals[0]?.startedAt
                            ? new Date(userRentals[0].startedAt).toLocaleDateString()
                            : '-';

                        const status = amount >= 250 ? 'CRITICAL' : amount >= 80 ? 'OVERDUE' : 'PENDING';

                        return {
                            id: idx + 1,
                            userId: user.id,
                            user: user.fullName || user.username || `User #${user.id}`,
                            email: user.email || '-',
                            totalDebt: amount,
                            lastRide,
                            status,
                        };
                    })
                    .filter(Boolean);

                if (mounted) {
                    setDebts(mappedDebts);
                    setLoadingData(false);
                }
            } catch {
                if (mounted) {
                    setDebts([]);
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
    const filteredDebts = debts.filter(debt =>
        debt.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDebts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDebts = filteredDebts.slice(startIndex, startIndex + itemsPerPage);

    const handleNotify = async (debt) => {
        if (!debt?.userId || notifyingId) return;

        setNotifyingId(debt.id);
        try {
            await api.post('/notifications/debt-reminder', {
                userId: debt.userId,
                message: `Outstanding balance: THB ${Number(debt.totalDebt || 0).toFixed(2)}. Please complete payment to continue rentals.`,
            });
            showToast.success(`Debt reminder sent to ${debt.user}.`);
        } catch {
            showToast.error('Failed to send debt reminder.');
        } finally {
            setNotifyingId(null);
        }
    };

    const stats = useMemo(() => {
        const totalOutstanding = debts.reduce((sum, item) => sum + Number(item.totalDebt || 0), 0);
        const overdueUsers = debts.filter((item) => item.status === 'OVERDUE' || item.status === 'CRITICAL').length;
        const averageDebt = debts.length ? totalOutstanding / debts.length : 0;

        return [
            { label: 'Total Outstanding', val: `฿${totalOutstanding.toFixed(2)}`, icon: '💸' },
            { label: 'Overdue Users', val: String(overdueUsers), icon: '🏃' },
            { label: 'Avg Debt', val: `฿${averageDebt.toFixed(2)}`, icon: '📊' },
            { label: 'Accounts in Debt', val: String(debts.length), icon: '🔔' },
        ];
    }, [debts]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">Debt Management</h1>
                <p className="text-[#6B7280] font-medium">Track unpaid balances and notify users of outstanding dues.</p>
            </header>

            {/* Debt Stats */}
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
                    <h2 className="text-xl font-semibold tracking-wide text-[#8B2E2E]">Delinquent Accounts</h2>
                    <input
                        type="text"
                        placeholder="Search rider name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-80 bg-white border border-[#D1D5DB] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B2E2E] transition-all font-medium text-[#2F2F2F] placeholder:text-[#9CA3AF]"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280] bg-[#F9FAFB]">
                                <th className="px-8 py-6">Rider</th>
                                <th className="px-8 py-6">Total Debt</th>
                                <th className="px-8 py-6">Last Active</th>
                                <th className="px-8 py-6">Risk Level</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {loadingData && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-[#6B7280] font-medium italic">
                                        Loading outstanding balances...
                                    </td>
                                </tr>
                            )}

                            {paginatedDebts.map(debt => (
                                <tr key={debt.id} className="hover:bg-[#FCFCFC] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-semibold text-[#2F2F2F]">{debt.user}</div>
                                        <div className="text-[11px] text-[#6B7280]">{debt.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-semibold text-[#B91C1C]">฿{debt.totalDebt.toFixed(2)}</td>
                                    <td className="px-8 py-6 text-xs font-medium text-[#6B7280]">{debt.lastRide}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${debt.status === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]' :
                                            debt.status === 'OVERDUE' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]' :
                                                'bg-[#FEF9C3] text-[#A16207] border-[#FDE68A]'
                                            }`}>
                                            {debt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Button
                                            variant="outline"
                                            className="px-4 py-2 text-xs font-medium hover:bg-[#FCEAEA] hover:text-[#8B2E2E] transition-colors"
                                            onClick={() => handleNotify(debt)}
                                            disabled={notifyingId === debt.id}
                                        >
                                            {notifyingId === debt.id ? 'Sending...' : 'Notify User'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {!loadingData && paginatedDebts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-[#6B7280] font-medium italic">
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
