import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const AdminProfile = ({ user }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">Admin Profile</h1>
                <p className="text-[#6B7280] font-medium">Manage your administrative identity and security settings.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center p-12">
                        <div className="w-32 h-32 bg-[#8B2E2E] rounded-2xl flex items-center justify-center font-semibold text-5xl text-white mx-auto mb-8 shadow-md">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-semibold text-[#2F2F2F] mb-2">{user?.username}</h2>
                        <div className="px-4 py-1.5 bg-[#FCEAEA] text-[#8B2E2E] border border-[#F2CACA] rounded-full text-[11px] font-semibold inline-block mb-8">
                            System Administrator
                        </div>
                        <div className="space-y-2 pt-8 border-t border-[#E5E7EB]">
                            <div className="text-xs font-medium text-[#6B7280] tracking-wide">Employee ID</div>
                            <div className="text-[#2F2F2F] font-semibold font-mono tracking-tight text-lg">ADM-2026-X8</div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="space-y-8 p-12">
                        <h3 className="text-xl font-semibold text-[#2F2F2F] tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#8B2E2E] rounded-full"></span>
                            Identity Settings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Display Name" value={user?.username} disabled />
                            <Input label="Email Address" value={`${user?.username}@campus-admin.edu`} disabled />
                        </div>

                        <div className="pt-8 border-t border-[#E5E7EB]">
                            <h3 className="text-xl font-semibold text-[#2F2F2F] tracking-tight flex items-center gap-3 mb-8">
                                <span className="w-2 h-8 bg-[#8B2E2E] rounded-full"></span>
                                Security & Access
                            </h3>
                            <div className="grid grid-cols-1 gap-8 max-w-md">
                                <Input label="Current Password" type="password" value="••••••••" disabled />
                                <Button variant="outline" className="w-full py-3 text-sm font-medium">
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
