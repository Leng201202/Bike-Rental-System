import React, { useState } from 'react';
import Button from '../UI/Button';

const RentalModal = ({ isOpen, onClose, bike, onConfirm }) => {
    const [selectedMethod, setSelectedMethod] = useState('HOURLY');
    const [step, setStep] = useState('SELECT'); // SELECT or REVIEW

    if (!isOpen || !bike) return null;

    const handleClose = () => {
        setStep('SELECT');
        onClose();
    };

    const handleConfirm = () => {
        if (step === 'SELECT') {
            setStep('REVIEW');
        } else {
            onConfirm(selectedMethod);
            setStep('SELECT');
        }
    };

    const methods = [
        {
            id: 'HOURLY',
            title: 'Hourly Plan',
            price: `THB ${bike.pricePerHour}/hr`,
            description: 'Perfect for short trips and quick errands around campus.',
            icon: '⏱️',
            details: 'Includes basic maintenance and flexible return options within 24 hours.'
        },
        {
            id: 'MILEAGE',
            title: 'Mileage Plan',
            price: `THB ${bike.pricePerKm}/km`,
            description: 'Best for long-distance travel and exploring far-off trails.',
            icon: '🛣️',
            details: 'Fixed rate per kilometer. Ideal for sightseeing and day trips.'
        }
    ];

    const selectedPlan = methods.find(m => m.id === selectedMethod);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-10 relative animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <button
                    onClick={handleClose}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {step === 'SELECT' ? (
                    <>
                        <div className="text-center mb-10">
                            <div className="mb-4 inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                                Step 1: Select Plan
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight text-white">Choose Your Plan</h2>
                            <p className="text-gray-500 text-xs font-bold italic">Select how you want to pay for your ride on {bike.name}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-10">
                            {methods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`group relative p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 text-left transition-all duration-300 ${selectedMethod === method.id
                                            ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
                                            : 'bg-gray-800/20 border-gray-700/50 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-transform duration-500 ${selectedMethod === method.id ? 'bg-blue-600 text-white scale-110' : 'bg-gray-800 text-gray-400 group-hover:scale-105'
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
                    </>
                ) : (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="mb-4 inline-block px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400">
                                Step 2: Review Order
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight text-white">Review Summary</h2>
                            <p className="text-gray-500 text-xs font-bold italic">Please confirm your rental details below</p>
                        </div>

                        <div className="bg-gray-800/20 border border-gray-700/50 rounded-3xl p-6 mb-8">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl">
                                        {selectedPlan.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase text-sm tracking-tight">{bike.name}</h4>
                                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{selectedPlan.title}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-black text-lg">{selectedPlan.price}</p>
                                    <p className="text-gray-500 text-[10px] font-black uppercase">Rate</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500 uppercase tracking-widest">Initial Deposit</span>
                                    <span className="text-white">THB 0.00</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500 uppercase tracking-widest">Max Duration</span>
                                    <span className="text-white">24 Hours</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500 uppercase tracking-widest">Pickup Location</span>
                                    <span className="text-white">{bike.location?.zone || 'Campus'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 mb-10">
                            <p className="text-[10px] text-blue-400/80 font-bold leading-relaxed">
                                <span className="font-black uppercase tracking-widest mr-2 text-blue-400">Policy:</span>
                                Your rental session starts immediately after confirmation. Charges are calculated based on your selected plan upon return.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={step === 'SELECT' ? handleClose : () => setStep('SELECT')}
                        className="flex-1 py-4 uppercase font-black tracking-widest text-[10px] border-gray-800 text-gray-400"
                    >
                        {step === 'SELECT' ? 'Cancel' : 'Back'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        className="flex-1 py-4 uppercase font-black tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                    >
                        {step === 'SELECT' ? 'Continue' : 'Start Rental'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RentalModal;
