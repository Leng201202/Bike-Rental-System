import React from 'react';

const UserProfile = ({ user }) => {
    return (
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-800/20 border border-gray-700/30 p-10 rounded-[2.5rem] backdrop-blur-xl">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">{user?.username}</h3>
                        <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">{user?.role}</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Member Since</label>
                        <div className="text-white font-bold">February 2026</div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Campus ID</label>
                        <div className="text-white font-bold">ST-48293</div>
                    </div>
                    <div className="pt-6 border-t border-gray-700/50">
                        <button className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors flex items-center gap-2">
                            Edit Profile Settings
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
