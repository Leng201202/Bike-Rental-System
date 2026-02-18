import React from 'react';

const ManageRentals = ({ activeRentals }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                        Currently Rented
                    </h2>
                </div>
                {activeRentals.length > 0 ? (
                    activeRentals.map(rental => (
                        <div key={rental.id} className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="text-8xl font-black italic select-none">LIVE</div>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-black mb-1">{rental.bikeName}</h3>
                                    <p className="text-blue-300 text-sm font-medium">Started at {rental.startTime}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-white">${rental.currentCost.toFixed(2)}</div>
                                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-4">Current Accumulated Cost</p>
                                    <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                                        Return Bike
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-800/10 border border-gray-700/30 p-12 rounded-[2rem] text-center italic text-gray-500">
                        No active rentals.
                    </div>
                )}
            </section>
        </div>
    );
};

export default ManageRentals;
