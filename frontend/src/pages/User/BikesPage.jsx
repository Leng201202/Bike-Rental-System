import React, { useEffect, useState } from 'react';
import useBikeStore from '../../store/useBikeStore';
import BikeCard from '../../components/Bikes/BikeCard';
import BikeFilterBar from '../../components/Bikes/BikeFilterBar';
import RentalModal from '../../components/Bikes/RentalModal';
import { showToast } from '../../components/UI/PremiumToast';

const BikesPage = ({ isCompact = false }) => {
    const { bikes, fetchBikes, rentBike, loading } = useBikeStore();
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('DEFAULT');
    const [selectedBike, setSelectedBike] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchBikes();
    }, [fetchBikes]);

    const filteredBikes = bikes
        .filter(bike => (filter === 'ALL' || bike.type === filter))
        .filter(bike => 
            bike.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            bike.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'PRICE_LOW') return a.pricePerHour - b.pricePerHour;
            if (sortBy === 'PRICE_HIGH') return b.pricePerHour - a.pricePerHour;
            if (sortBy === 'AVAILABILITY') {
                if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
                if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1;
                return 0;
            }
            return 0;
        });

    const handleRentClick = (bike) => {
        setSelectedBike(bike);
        setIsModalOpen(true);
    };

    const handleConfirmRental = async (method) => {
        const success = await rentBike(selectedBike.id, method);
        if (success) {
            showToast.success(`Started rental for ${selectedBike.name}!`);
            setIsModalOpen(false);
        } else {
            showToast.error(`Failed to start rental for ${selectedBike.name}.`);
        }
    };

    return (
        <div className={`${isCompact ? 'py-0 px-0' : 'min-h-screen py-12 px-4'} max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            {!isCompact && (
                <div className="mb-6 md:mb-12">
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Our Fleet</h1>
                    <p className="text-gray-400 font-medium">Choose your perfect ride for the day.</p>
                </div>
            )}

            <div className="flex flex-col gap-6 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {isCompact && (
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mr-auto">Available Fleet</h2>
                    )}
                    <BikeFilterBar activeFilter={filter} onChange={setFilter} />
                    
                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search bikes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-10 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-gray-800/60 transition-all"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800/40 border border-gray-700/50 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-10 relative"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                        >
                            <option value="DEFAULT">Sort By</option>
                            <option value="PRICE_LOW">Price: Low to High</option>
                            <option value="PRICE_HIGH">Price: High to Low</option>
                            <option value="AVAILABILITY">Availability</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-96 bg-gray-800/20 rounded-[2.5rem] animate-pulse"></div>
                    ))}
                </div>
            ) : filteredBikes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBikes.map((bike) => (
                        <BikeCard key={bike.id} bike={bike} onRent={() => handleRentClick(bike)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-800/10 rounded-[3rem] border border-dashed border-gray-700">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">No bikes found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            )}

            <RentalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bike={selectedBike}
                onConfirm={handleConfirmRental}
            />
        </div>
    );
};

export default BikesPage;
