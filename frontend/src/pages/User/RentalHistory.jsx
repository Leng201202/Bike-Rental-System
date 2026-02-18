import React from 'react';

const RentalHistory = ({ history }) => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-6">Past Adventures</h2>
            <div className="grid gap-4">
                {history.map(item => (
                    <div key={item.id} className="bg-gray-800/30 border border-gray-700/30 p-8 rounded-3xl flex justify-between items-center group hover:bg-gray-800/50 transition-all">
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">{item.bikeName}</h4>
                            <p className="text-gray-500 text-sm font-medium">{item.date} • {item.duration}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-white">${item.totalCost.toFixed(2)}</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Paid</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RentalHistory;
