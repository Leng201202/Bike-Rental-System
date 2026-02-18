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

    // Mock Data (In a real app, these would come from the store/API)
    const activeRentals = [
        { id: 101, bikeName: 'Electric Spark S5', startTime: '2026-02-19 10:30', currentCost: 12.50, status: 'ACTIVE' },
    ];

    const rentalHistory = [
        { id: 98, bikeName: 'City Cruiser v2', date: '2026-02-18', duration: '2h 15m', totalCost: 7.85 },
        { id: 95, bikeName: 'Mountain Explorer X1', date: '2026-02-15', duration: '4h 0m', totalCost: 22.00 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'bikes':
                return <BikesPage isCompact={true} />;
            case 'manage':
                return <ManageRentals activeRentals={activeRentals} />;
            case 'history':
                return <RentalHistory history={rentalHistory} />;
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
                    <h1 className="text-4xl font-black mb-2 animate-in slide-in-from-left duration-700">Rider Dashboard</h1>
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
