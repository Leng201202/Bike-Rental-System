import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import BikesPage from './BikesPage';
import ManageRentals from './ManageRentals';
import RentalHistory from './RentalHistory';
import UserProfile from './UserProfile';

const UserDashboard = () => {
    const { user } = useAuthStore();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'bikes';

    const renderContent = () => {
        switch (activeTab) {
            case 'bikes':
                return <BikesPage isCompact={true} />;
            case 'manage':
                return <ManageRentals />;
            case 'history':
                return <RentalHistory />;
            case 'profile':
                return <UserProfile user={user} />;
            default:
                return <BikesPage isCompact={true} />;
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 animate-in slide-in-from-left duration-700">
                        {user?.fullName ? `Welcome, ${user.fullName.split(' ')[0]}` : 'Rider Dashboard'}
                    </h1>
                    <p className="text-gray-400 font-medium italic">
                        {activeTab === 'bikes' && "Choose your perfect ride for the day."}
                        {activeTab === 'manage' && "Manage your active rentals and returns."}
                        {activeTab === 'history' && "Review your past rentals and spendings."}
                        {activeTab === 'profile' && "View and edit your personal information."}
                    </p>
                </div>
            </header>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default UserDashboard;
