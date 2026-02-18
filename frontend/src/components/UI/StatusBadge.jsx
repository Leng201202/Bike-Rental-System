import React from 'react';

const StatusBadge = ({ status, className = "" }) => {
    const config = {
        AVAILABLE: 'bg-green-500/20 text-green-400 border-green-500/30',
        RENTED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        MAINTENANCE: 'bg-red-500/20 text-red-400 border-red-500/30',
        COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    return (
        <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${config[status] || config.CANCELLED} ${className}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default StatusBadge;
