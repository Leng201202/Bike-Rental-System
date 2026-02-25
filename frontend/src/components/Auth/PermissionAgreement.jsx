import React, { useState } from 'react';
import PermissionCard from '../UI/PermissionCard';
import PolicyModal from '../UI/PolicyModal';
import { showToast } from '../UI/PremiumToast';

const PermissionAgreement = ({ onComplete, initialPermissions = {} }) => {
    const [permissions, setPermissions] = useState({
        location: initialPermissions.location || false,
        tracking: initialPermissions.tracking || false,
        agreement: initialPermissions.agreement || false
    });

    const [modalData, setModalData] = useState(null);

    const handleToggle = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleReadMore = (type) => {
        const details = {
            location: {
                title: "Location Tracking Policy",
                content: "We use your location to track distance during active rentals for billing and to help you find bikes. Data is only collected while you are using a bike."
            },
            agreement: {
                title: "Terms & Conditions",
                content: "1. Park in designated zones.\n2. Wear a helmet.\n3. Do not share your account.\n4. You are responsible for any damages."
            }
        };
        setModalData(details[type]);
    };

    const handleProceed = () => {
        if (!permissions.location) {
            showToast.error("Please enable Location Tracking to proceed.");
            return;
        }
        if (!permissions.agreement) {
            showToast.error("Please agree to the Terms of Service to proceed.");
            return;
        }

        if (onComplete) {
            onComplete(permissions);
        }
    };

    return (
        <div className="space-y-6">
            <PermissionCard
                title="Precise Location"
                description="Track distance for billing."
                isActive={permissions.location}
                activeColor="blue"
                onToggle={() => handleToggle('location')}
                onReadMore={() => handleReadMore('location')}
                readMoreLabel="Read Policy"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
            />

            <PermissionCard
                title="Terms & Conditions"
                description="Follow campus safety rules."
                isActive={permissions.agreement}
                activeColor="indigo"
                onToggle={() => handleToggle('agreement')}
                onReadMore={() => handleReadMore('agreement')}
                readMoreLabel="Read Terms"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
            />

            <button
                onClick={handleProceed}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transform transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
            >
                Continue
            </button>

            <PolicyModal
                isOpen={!!modalData}
                onClose={() => setModalData(null)}
                title={modalData?.title}
                content={modalData?.content}
            />
        </div>
    );
};

export default PermissionAgreement;
