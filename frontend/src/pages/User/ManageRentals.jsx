import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBikeStore from '../../store/useBikeStore';
import Button from '../../components/UI/Button';

const ManageRentals = () => {
    const navigate = useNavigate();
    const { activeRentals } = useBikeStore();
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Live ticking clock for tracking
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleReturnClick = (rental) => {
        navigate('/payment', { state: { rental } });
    };

    // Helper functions for live calculations
    const getElapsedSeconds = (startTime) => {
        return Math.floor((currentTime - new Date(startTime).getTime()) / 1000);
    };

    const formatDuration = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const calculateSimulatedDistance = (totalSeconds) => {
        // Assume an average biking speed of 15 km/h
        const speedKmsPerSecond = 15 / 3600;
        return (totalSeconds * speedKmsPerSecond).toFixed(2);
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                        Currently Rented
                    </h2>
                </div>
                {activeRentals.length > 0 ? (
                    <div className="space-y-4 md:space-y-6">
                        {activeRentals.map(rental => {
                            const elapsedSeconds = getElapsedSeconds(rental.startTime);
                            const activeDuration = formatDuration(elapsedSeconds);
                            const activeDistance = calculateSimulatedDistance(elapsedSeconds);

                            return (
                                <div key={rental.id} className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <div className="text-5xl md:text-8xl font-black italic select-none">LIVE</div>
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-xl md:text-2xl font-black">{rental.bikeName}</h3>
                                                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                                    {rental.method}
                                                </div>
                                            </div>

                                            {/* Live Telemetry Data */}
                                            <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-6 max-w-sm">
                                                {rental.method === 'HOURLY' ? (
                                                    <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center">
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Time Elapsed</span>
                                                        <span className="text-lg md:text-2xl font-mono text-white font-bold tracking-tighter">{activeDuration}</span>
                                                    </div>
                                                ) : (
                                                    <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center">
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Distance</span>
                                                        <span className="text-lg md:text-2xl font-mono text-white font-bold tracking-tighter">{activeDistance} <span className="text-sm">km</span></span>
                                                    </div>
                                                )}

                                                <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Current Fee</span>
                                                    <span className="text-lg md:text-2xl font-mono text-white tracking-tighter shadow-blue-500/20 drop-shadow-lg">
                                                        <span className="text-blue-500 mr-1 text-sm">฿</span>{rental.currentCost.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right mt-2 md:mt-0 w-full md:w-auto">
                                            <Button
                                                onClick={() => handleReturnClick(rental)}
                                                className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95 shadow-xl shadow-red-600/20"
                                            >
                                                End Ride & Pay
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-gray-800/10 border border-gray-700/30 p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] text-center italic text-gray-500">
                        No active rentals. Browse the fleet to start a journey.
                    </div>
                )}
            </section>
        </div>
    );
};

export default ManageRentals;
