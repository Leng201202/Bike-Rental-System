import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { showToast } from '../../components/UI/PremiumToast';
import PermissionAgreement from '../../components/Auth/PermissionAgreement';

const Permissions = () => {
    const navigate = useNavigate();
    const { setAgreedToTerms } = useAuthStore();

    const handleComplete = () => {
        // Save agreement to store and localStorage
        setAgreedToTerms(true);
        showToast.success("Permissions granted! Welcome aboard.", <span className="text-xl">🚲</span>);
        navigate('/rider');
    };

    return (
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-gray-800/50 backdrop-blur-xl p-10 rounded-3xl border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Almost There!</h2>
                        <p className="text-gray-400">To provide the best experience on campus, we need a few permissions from you.</p>
                    </div>

                    <PermissionAgreement onComplete={handleComplete} />

                    <p className="text-center text-gray-500 mt-8 text-xs">
                        By proceeding, you acknowledge our Privacy Policy and Safety Guidelines.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Permissions;
