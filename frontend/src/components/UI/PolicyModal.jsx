import React from 'react';

const PolicyModal = ({ isOpen, onClose, title, content, confirmLabel = "Got it" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-[#E5E7EB] w-full max-w-md p-8 rounded-2xl shadow-xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-[#2F2F2F]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="text-[#4B5563] text-sm leading-relaxed whitespace-pre-line bg-[#F9FAFB] p-6 rounded-xl border border-[#E5E7EB] max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {content}
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 bg-[#8B2E2E] hover:bg-[#6F2323] text-white font-semibold rounded-md transition-colors active:scale-[0.98]"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};

export default PolicyModal;
