import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';

const PaymentModal = ({ isOpen, onClose, onConfirm, amount, title = "Complete Payment" }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState('QR'); // QR -> PROCESSING -> SUCCESS

    useEffect(() => {
        if (!isOpen) {
            setStep('QR');
            setIsProcessing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsProcessing(true);
        setStep('PROCESSING');

        // Simulate payment verification delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const success = await onConfirm();
        if (success) {
            setStep('SUCCESS');
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setStep('QR');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#121212] border border-gray-800 w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {step === 'QR' && (
                    <div className="text-center">
                        <div className="mb-6 inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                            Secure PromptPay Terminal
                        </div>
                        <h2 className="text-3xl font-black mb-2 uppercase tracking-tight text-white">{title}</h2>
                        <div className="text-4xl font-black text-white mb-8">
                            <span className="text-xl text-gray-500 mr-1 font-bold">฿</span>
                            {amount.toFixed(2)}
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="bg-white p-6 rounded-3xl mb-8 inline-block shadow-2xl shadow-white/5 relative group">
                            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center relative">
                                {/* Simulated QR Pattern */}
                                <div className="grid grid-cols-4 gap-2 w-full h-full p-4 opacity-20">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className="bg-black rounded-sm"></div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-4xl mb-2">📱</div>
                                    <div className="text-[10px] font-black text-black uppercase tracking-widest opacity-40">Scan to Pay</div>
                                </div>
                            </div>
                            {/* Scanning line animation */}
                            <div className="absolute left-6 right-6 h-0.5 bg-blue-500 top-6 animate-scan shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleConfirm}
                                loading={isProcessing}
                                variant="primary"
                                className="w-full py-5 rounded-2xl uppercase font-black tracking-[0.2em] text-xs"
                            >
                                I've Paid
                            </Button>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                Verification happens instantly<br />powered by campus banking
                            </p>
                        </div>
                    </div>
                )}

                {step === 'PROCESSING' && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Verifying Funds</h3>
                        <p className="text-gray-500 text-xs font-bold italic">Consulting blockchain ledger...</p>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="text-center py-20 animate-in zoom-in-50 duration-500">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl shadow-green-500/20">
                            ✓
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Payment Confirmed</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Transaction TRX-{Math.floor(Math.random() * 90000 + 10000)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
