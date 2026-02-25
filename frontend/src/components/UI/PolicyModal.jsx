import React from 'react';

const PolicyModal = ({ isOpen, onClose, title, content, confirmLabel = "Got it" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-800 border border-gray-700 w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-900/50 p-6 rounded-2xl border border-gray-700 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {content}
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};

export default PolicyModal;
