import React, { useEffect, useState } from 'react';
import useBikeStore from '../../store/useBikeStore';
import BikeCard from '../../components/Bikes/BikeCard';
import BikeFilterBar from '../../components/Bikes/BikeFilterBar';
import { showToast } from '../../components/UI/PremiumToast';

const BikesPage = ({ isCompact = false }) => {
    const { bikes, fetchBikes, loading } = useBikeStore();
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchBikes();
    }, [fetchBikes]);

    const filteredBikes = filter === 'ALL'
        ? bikes
        : bikes.filter(bike => bike.type === filter);

    const handleRent = (bike) => {
        showToast.success(`Starting rental for ${bike.name}...`);
        // Logic for rental would go here
    };

    return (
        <div className={`${isCompact ? 'py-0 px-0' : 'min-h-screen py-12 px-4'} max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            {!isCompact && (
                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Our Fleet</h1>
                    <p className="text-gray-400 font-medium">Choose your perfect ride for the day.</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                {isCompact && (
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mr-auto">Available Fleet</h2>
                )}
                <BikeFilterBar activeFilter={filter} onChange={setFilter} />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-96 bg-gray-800/20 rounded-[2.5rem] animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBikes.map((bike) => (
                        <BikeCard key={bike.id} bike={bike} onRent={handleRent} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BikesPage;
