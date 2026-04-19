import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import PaymentModal from '../../components/UI/PaymentModal';
import { showToast } from '../../components/UI/toast';

const UserProfile = () => {
    const { user, updateProfile, payDebt, loading } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        studentId: user?.studentId || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'studentId' && user?.studentId) {
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.studentId?.trim()) {
            showToast.error('Student ID is required to use rental features.');
            return;
        }

        const success = await updateProfile(formData);
        if (success) {
            showToast.success("Profile updated successfully!");
            setIsEditing(false);
        } else {
            showToast.error("Failed to update profile.");
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            studentId: user?.studentId || '',
        });
        setIsEditing(false);
    };

    const studentIdMissing = !user?.studentId;

    return (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gray-800/20 border border-gray-700/30 p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl overflow-hidden relative group">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 relative z-10">
                    {/* Avatar Logic */}
                    <div className="relative group">
                        <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-500/20 transform transition-transform group-hover:scale-105 duration-500">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        {isEditing && (
                            <button className="absolute inset-0 bg-black/60 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Change</span>
                            </button>
                        )}
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black mb-1 uppercase tracking-tight">{user?.fullName || user?.username}</h3>
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">
                                {user?.role}
                            </span>
                            <span className="text-gray-500 text-xs font-bold italic">Active since {user?.memberSince}</span>
                        </div>
                    </div>

                    {user?.debt > 0 && (
                        <div className="md:ml-auto w-full md:w-auto">
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-xl">💸</div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-red-400 tracking-widest">Outstanding Debt</div>
                                    <div className="text-xl font-black text-white mb-2">฿{user.debt.toFixed(2)}</div>
                                    <Button
                                        onClick={() => setIsPaymentModalOpen(true)}
                                        variant="primary"
                                        className="py-1.5 px-4 text-[9px]"
                                    >
                                        Settle Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {studentIdMissing && (
                    <div className="mb-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs font-bold uppercase tracking-wide">
                        Complete Student ID in profile settings to unlock bike rental, live tracking, and payment features.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <Input
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                readOnly={!isEditing}
                                placeholder="Enter your full name"
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                readOnly={!isEditing}
                                placeholder="name@uni.edu"
                            />
                        </div>
                        <div className="space-y-6">
                            <Input
                                label="Student ID"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                disabled={!isEditing || Boolean(user?.studentId)}
                                readOnly={!isEditing || Boolean(user?.studentId)}
                                placeholder="64XXXXXXXX"
                                required={isEditing}
                            />
                            {user?.studentId && (
                                <p className="text-xs text-[#6B7280] -mt-4">
                                    Student ID cannot be changed after it is set.
                                </p>
                            )}
                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={true}
                                readOnly={true}
                                placeholder="+66 XX-XXX-XXXX"
                                className="opacity-70"
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        {!isEditing ? (
                            <>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Account Security</h4>
                                    <p className="text-[10px] text-gray-500 font-bold italic">Last changed: 3 months ago</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-8 py-3 text-[10px] uppercase font-black tracking-widest"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile Settings
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-4 w-full sm:w-auto ml-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 sm:flex-none px-10 py-3 text-[10px] uppercase font-black tracking-widest border-gray-600/50 text-gray-400"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1 sm:flex-none px-10 py-3 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-blue-500/20"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving Changes...' : 'Save Settings'}
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Account Management Sidebar/Bottom Section */}
            {!isEditing && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="!p-8 group hover:border-red-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-sm font-black uppercase text-white mb-1">Danger Zone</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Deactivate or delete account</p>
                            </div>
                            <span className="text-red-500 opacity-20 group-hover:opacity-100 transition-opacity">⚠️</span>
                        </div>
                        {user?.debt > 0 ? (
                            <div className="text-[10px] font-bold text-red-500/70 italic uppercase tracking-widest">
                                Cannot delete account with active debt.
                            </div>
                        ) : (
                            <button className="text-xs text-red-500 hover:text-red-400 font-black uppercase tracking-widest transition-colors">Terminate Account</button>
                        )}
                    </Card>
                    <Card className="!p-8 group hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-sm font-black uppercase text-white mb-1">Privacy Control</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Manage shared location data</p>
                            </div>
                            <span className="text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">🛡️</span>
                        </div>
                        <button className="text-xs text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest transition-colors">Privacy Settings</button>
                    </Card>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={user?.debt || 0}
                title="Settle Outstanding Debt"
                onConfirm={async () => {
                    const success = await payDebt(user.debt);
                    if (success) {
                        showToast.success("Debt settled successfully!");
                        return true;
                    }
                    return false;
                }}
            />
        </div>
    );
};

export default UserProfile;
