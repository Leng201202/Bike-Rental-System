import Card from '../../components/UI/Card';

const AuditLogs = () => {
    // Mock Audit LogsData
    const logs = [
        { id: 1, action: 'BIKE_ADDED', user: 'admin_jane', detail: 'Added new Electric Spark S5', timestamp: '2026-02-19 09:12' },
        { id: 2, action: 'USER_ROLE_CHANGE', user: 'super_admin', detail: 'Changed jsmith from RIDER to ADMIN', timestamp: '2026-02-18 14:45' },
        { id: 3, action: 'MAINTENANCE_LOG', user: 'admin_mark', detail: 'Set Bike #021 to MAINTENANCE', timestamp: '2026-02-18 11:20' },
        { id: 4, action: 'SYSTEM_CONFIG', user: 'system', detail: 'Updated hourly rates for Electric bikes', timestamp: '2026-02-17 23:59' },
        { id: 5, action: 'BIKE_REMOVED', user: 'admin_jane', detail: 'Retired Road King 2022 model', timestamp: '2026-02-17 08:30' },
    ];

    const getActionStyle = (action) => {
        if (action.includes('BIKE')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (action.includes('USER')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (action.includes('MAINTENANCE')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">System Audit Logs</h1>
                <p className="text-gray-400 font-medium">Traceable history of all administrative actions and system updates.</p>
            </header>

            <div className="space-y-4">
                {logs.map(log => (
                    <div key={log.id} className="bg-gray-800/20 border border-gray-700/30 p-6 rounded-[2rem] flex items-center justify-between group hover:border-gray-600/50 transition-all backdrop-blur-md">
                        <div className="flex items-center gap-6">
                            <div className="text-xs font-black text-gray-500 w-32 font-mono">{log.timestamp}</div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getActionStyle(log.action)}`}>
                                {log.action.replace('_', ' ')}
                            </div>
                            <div className="text-sm">
                                <span className="font-black text-white mr-2">@{log.user}</span>
                                <span className="text-gray-400 italic">"{log.detail}"</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditLogs;
