import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const AdminProfile = ({ user }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Admin Profile</h1>
                <p className="text-gray-400 font-medium">Manage your administrative identity and security settings.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center p-12">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-white mx-auto mb-8 shadow-2xl shadow-blue-500/20 ring-4 ring-white/5">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">{user?.username}</h2>
                        <div className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-8">
                            System Administrator
                        </div>
                        <div className="space-y-2 pt-8 border-t border-gray-700/30">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Employee ID</div>
                            <div className="text-white font-black font-mono tracking-tighter text-lg">ADM-2026-X8</div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="space-y-8 p-12">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                            Identity Settings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Display Name" value={user?.username} disabled />
                            <Input label="Email Address" value={`${user?.username}@campus-admin.edu`} disabled />
                        </div>

                        <div className="pt-8 border-t border-gray-700/30">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3 mb-8">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                Security & Access
                            </h3>
                            <div className="grid grid-cols-1 gap-8 max-w-md">
                                <Input label="Current Password" type="password" value="••••••••" disabled />
                                <Button variant="outline" className="w-full py-4 uppercase tracking-widest text-xs">
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
