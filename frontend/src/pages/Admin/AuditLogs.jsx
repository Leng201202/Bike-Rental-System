import { useEffect, useMemo, useState } from 'react';
import api, { unwrapApiResponse } from '../../api/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const response = await api.get('/audit-logs?limit=200');
                const merged = (unwrapApiResponse(response) || []).map((item) => ({
                    id: item.id,
                    action: item.action,
                    user: item.actorUsername || 'system',
                    detail: item.detail || `${item.targetType || 'SYSTEM'} ${item.targetId || ''}`.trim(),
                    timestamp: item.createdAt,
                }));

                if (mounted) {
                    setLogs(merged);
                    setLoadingData(false);
                }
            } catch {
                if (mounted) {
                    setLogs([]);
                    setLoadingData(false);
                }
            }
        };

        loadData();
        return () => {
            mounted = false;
        };
    }, []);

    const getActionStyle = (action) => {
        if (action.includes('PAYMENT')) return 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]';
        if (action.includes('DEBT')) return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
        if (action.includes('RENTAL')) return 'bg-[#FCEAEA] text-[#8B2E2E] border-[#F2CACA]';
        return 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]';
    };

    const displayLogs = useMemo(() => logs.slice(0, 120), [logs]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">System Audit Logs</h1>
                <p className="text-[#6B7280] font-medium">Traceable history of all administrative actions and system updates.</p>
            </header>

            <div className="space-y-4">
                {loadingData && (
                    <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl text-sm text-[#6B7280]">
                        Loading audit logs...
                    </div>
                )}

                {!loadingData && displayLogs.length === 0 && (
                    <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl text-sm text-[#6B7280]">
                        No audit records available yet.
                    </div>
                )}

                {displayLogs.map(log => (
                    <div key={log.id} className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex items-center justify-between group hover:border-[#D1D5DB] transition-colors">
                        <div className="flex items-center gap-6">
                            <div className="text-xs font-semibold text-[#6B7280] w-40 font-mono">{new Date(log.timestamp).toLocaleString()}</div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${getActionStyle(log.action)}`}>
                                {log.action.replace('_', ' ')}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold text-[#2F2F2F] mr-2">@{log.user}</span>
                                <span className="text-[#6B7280] italic">"{log.detail}"</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditLogs;
