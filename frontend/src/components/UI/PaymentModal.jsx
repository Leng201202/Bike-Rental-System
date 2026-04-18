import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';

const PaymentModal = ({ isOpen, onClose, onConfirm, amount, title = "Complete Payment" }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState('QR'); // QR -> PROCESSING -> SUCCESS
    const [transactionId, setTransactionId] = useState('TRX-00000');

    const handleClose = () => {
        setStep('QR');
        setIsProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsProcessing(true);
        setStep('PROCESSING');

        // Simulate payment verification delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const success = await onConfirm();
        if (success) {
            setTransactionId(`TRX-${Math.floor(Math.random() * 90000 + 10000)}`);
            setStep('SUCCESS');
            setTimeout(() => {
                handleClose();
            }, 1500);
        } else {
            setStep('QR');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-[#E5E7EB] w-full max-w-md rounded-2xl shadow-xl p-8 relative animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#8B2E2E]"></div>

                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {step === 'QR' && (
                    <div className="text-center">
                        <div className="mb-6 inline-block px-4 py-1.5 bg-[#FCEAEA] border border-[#F2CACA] rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#8B2E2E]">
                            Secure PromptPay
                        </div>
                        <h2 className="text-3xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">{title}</h2>
                        <div className="text-4xl font-semibold text-[#2F2F2F] mb-8">
                            <span className="text-xl text-[#6B7280] mr-1 font-semibold">฿</span>
                            {amount.toFixed(2)}
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="bg-white p-6 rounded-xl mb-8 inline-block shadow-sm border border-[#E5E7EB] relative group">
                            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center relative">
                                {/* Simulated QR Pattern */}
                                <div className="grid grid-cols-4 gap-2 w-full h-full p-4 opacity-20">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className="bg-black rounded-sm"></div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-4xl mb-2">📱</div>
                                    <div className="text-[10px] font-semibold text-black uppercase tracking-wide opacity-45">Scan to Pay</div>
                                </div>
                            </div>
                            {/* Scanning line animation */}
                            <div className="absolute left-6 right-6 h-0.5 bg-[#8B2E2E] top-6 animate-scan shadow-[0_0_12px_rgba(139,46,46,0.45)]"></div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleConfirm}
                                loading={isProcessing}
                                variant="primary"
                                className="w-full py-4 rounded-md uppercase font-semibold tracking-[0.12em] text-xs"
                            >
                                I Have Paid
                            </Button>
                            <p className="text-[11px] text-[#6B7280] font-medium leading-relaxed">
                                Payment confirmation usually completes in a few seconds.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'PROCESSING' && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 border-4 border-[#F2CACA] border-t-[#8B2E2E] rounded-full animate-spin mx-auto mb-8"></div>
                        <h3 className="text-xl font-semibold text-[#2F2F2F] uppercase tracking-wide mb-2">Verifying Payment</h3>
                        <p className="text-[#6B7280] text-sm">Please wait while we confirm your transaction.</p>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="text-center py-20 animate-in zoom-in-50 duration-500">
                        <div className="w-24 h-24 bg-[#ECFDF3] border border-[#A7F3D0] text-[#047857] rounded-full flex items-center justify-center text-5xl mx-auto mb-8">
                            ✓
                        </div>
                        <h3 className="text-2xl font-semibold text-[#2F2F2F] uppercase tracking-wide mb-2">Payment Confirmed</h3>
                        <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Transaction {transactionId}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
