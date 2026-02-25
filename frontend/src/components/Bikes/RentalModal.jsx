import React, { useState } from 'react';
import Button from '../UI/Button';

const RentalModal = ({ isOpen, onClose, bike, onConfirm }) => {
    const [selectedMethod, setSelectedMethod] = useState('HOURLY');

    if (!isOpen || !bike) return null;

    const methods = [
        {
            id: 'HOURLY',
            title: 'Hourly Plan',
            price: `฿${bike.pricePerHour}/hr`,
            description: 'Perfect for short trips and quick errands around campus.',
            icon: '⏱️'
        },
        {
            id: 'MILEAGE',
            title: 'Mileage Plan',
            price: `฿${bike.pricePerKm}/km`,
            description: 'Best for long-distance travel and exploring far-off trails.',
            icon: '🛣️'
        }
    ];

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-10">
                    <div className="mb-4 inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                        Rental Configuration
                    </div>
                    <h2 className="text-3xl font-black mb-2 uppercase tracking-tight text-white">Choose Your Plan</h2>
                    <p className="text-gray-500 text-xs font-bold italic">Select how you want to pay for your ride on {bike.name}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-10">
                    {methods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`group relative p-6 rounded-3xl border-2 text-left transition-all duration-300 ${selectedMethod === method.id
                                    ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
                                    : 'bg-gray-800/20 border-gray-700/50 hover:border-gray-600'
                                }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 ${selectedMethod === method.id ? 'bg-blue-600 text-white scale-110' : 'bg-gray-800 text-gray-400 group-hover:scale-105'
                                    }`}>
                                    {method.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`font-black uppercase tracking-tight ${selectedMethod === method.id ? 'text-white' : 'text-gray-400'}`}>
                                            {method.title}
                                        </h4>
                                        <span className={`text-xl font-black ${selectedMethod === method.id ? 'text-blue-400' : 'text-white'}`}>
                                            {method.price}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{method.description}</p>
                                </div>
                                {selectedMethod === method.id && (
                                    <div className="absolute -top-3 -right-3 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                        ✓
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 py-4 uppercase font-black tracking-widest text-xs border-gray-700 text-gray-400"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onConfirm(selectedMethod)}
                        className="flex-1 py-4 uppercase font-black tracking-widest text-xs shadow-lg shadow-blue-500/20"
                    >
                        Confirm Rental
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RentalModal;
