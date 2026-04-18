import React from 'react';
import toast from 'react-hot-toast';

const PremiumToast = ({ t, message, type = 'error', icon }) => {
    const isError = type === 'error';

    return (
        <div
            className={`${t.visible ? 'animate-in fade-in zoom-in slide-in-from-top-4' : 'animate-out fade-out zoom-out shadow-none'
                } max-w-md w-full bg-white border border-[#E5E7EB] shadow-lg rounded-xl pointer-events-auto flex overflow-hidden transition-all duration-300`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className={`flex-shrink-0 pt-0.5`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isError ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]' : 'bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]'}`}>
                            {icon || (isError ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-[#2F2F2F] mb-0.5">
                            {isError ? 'Attention Required' : 'Success'}
                        </p>
                        <p className="text-xs font-medium text-[#6B7280]">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-[#E5E7EB]">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-xs font-semibold text-[#6B7280] hover:text-[#8B2E2E] hover:bg-[#FCEAEA] transition-all focus:outline-none"
                >
                    CLOSE
                </button>
            </div>
        </div>
    );
};

export default PremiumToast;
