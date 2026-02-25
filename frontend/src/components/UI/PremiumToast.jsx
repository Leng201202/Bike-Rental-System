import React from 'react';
import toast from 'react-hot-toast';

const PremiumToast = ({ t, message, type = 'error', icon }) => {
    const isError = type === 'error';

    return (
        <div
            className={`${t.visible ? 'animate-in fade-in zoom-in slide-in-from-top-4' : 'animate-out fade-out zoom-out shadow-none'
                } max-w-md w-full bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className={`flex-shrink-0 pt-0.5`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isError ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
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
                        <p className="text-sm font-bold text-white mb-0.5">
                            {isError ? 'Attention Required' : 'Success'}
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-white/5">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-xs font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
                >
                    CLOSE
                </button>
            </div>
        </div>
    );
};

export const showToast = {
    error: (msg) => toast.custom((t) => <PremiumToast t={t} message={msg} type="error" />),
    success: (msg, icon) => toast.custom((t) => <PremiumToast t={t} message={msg} type="success" icon={icon} />),
};

export default PremiumToast;
