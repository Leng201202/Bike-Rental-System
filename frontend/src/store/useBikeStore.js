import { create } from 'zustand';
import api from '../api/api';

const mockBikes = [
    { id: 1, name: 'Mountain Explorer X1', type: 'MOUNTAIN', status: 'AVAILABLE', pricePerHour: 20, pricePerKm: 2.0, imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ee05051da69?auto=format&fit=crop&q=80&w=800', description: 'Rugged and reliable for off-road campus trails.', location: { lat: 20.0494, lng: 99.8930, zone: 'North Gate' } },
    { id: 2, name: 'City Cruiser v2', type: 'ROAD', status: 'RENTED', pricePerHour: 15, pricePerKm: 2.0, imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800', description: 'The perfect companion for a smooth cross-campus commute.', location: { lat: 20.0461, lng: 99.8949, zone: 'Library Central' } },
    { id: 3, name: 'Electric Spark S5', type: 'ELECTRIC', status: 'AVAILABLE', pricePerHour: 35, pricePerKm: 2.0, imageUrl: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=800', description: 'Get there faster with zero effort and maximum style.', location: { lat: 20.0442, lng: 99.8961, zone: 'Science Hub' } },
    { id: 4, name: 'Road Master Pro', type: 'ROAD', status: 'AVAILABLE', pricePerHour: 25, pricePerKm: 2.0, imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=800', description: 'Lightweight frame for high-speed campus travel.', location: { lat: 20.0475, lng: 99.8968, zone: 'Engineering Plaza' } },
    { id: 5, name: 'Trail Blazer', type: 'MOUNTAIN', status: 'AVAILABLE', pricePerHour: 30, pricePerKm: 2.0, imageUrl: 'https://images.unsplash.com/photo-1544191696-102dbdaeeec6?auto=format&fit=crop&q=80&w=800', description: 'Tackle any terrain with advanced suspension.', location: { lat: 20.0425, lng: 99.8920, zone: 'Student Dorms' } },
    { id: 6, name: 'Urban Glide', type: 'CITY', status: 'MAINTENANCE', pricePerHour: 10, pricePerKm: 2.0, imageUrl: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&q=80&w=800', description: 'Simple, elegant, and ready for the city streets.', location: { lat: 20.0450, lng: 99.8990, zone: 'Sports Complex' } },
];

const useBikeStore = create((set) => ({
    bikes: mockBikes,
    loading: false,
    error: null,

    activeRentals: [
        {
            id: 101,
            bikeId: 3,
            bikeName: 'Electric Spark S5',
            bikeImage: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=800',
            bikeType: 'ELECTRIC',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            currentCost: 12.50,
            method: 'HOURLY',
            status: 'ACTIVE',
            lat: 20.0460, // MFU Chiang Rai
            lng: 99.8943
        },
    ],
    rentalHistory: [
        { id: 98, bikeId: 2, bikeName: 'City Cruiser v2', date: '2026-02-18', duration: '2h 15m', totalCost: 7.85 },
        { id: 95, bikeId: 1, bikeName: 'Mountain Explorer X1', date: '2026-02-15', duration: '4h 0m', totalCost: 22.00 },
    ],

    fetchBikes: async () => {
        set({ loading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            set({ bikes: mockBikes, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch bikes', loading: false });
        }
    },

    rentBike: async (bikeId, method) => {
        set({ loading: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const bike = useBikeStore.getState().bikes.find(b => b.id === bikeId);
            const newRental = {
                id: Math.floor(Math.random() * 1000) + 200,
                bikeId,
                bikeName: bike.name,
                bikeImage: bike.imageUrl,
                bikeType: bike.type,
                startTime: new Date().toISOString(),
                currentCost: 0,
                method, // 'HOURLY' or 'MILEAGE'
                status: 'ACTIVE',
                lat: 20.0460 + (Math.random() - 0.5) * 0.005,
                lng: 99.8943 + (Math.random() - 0.5) * 0.005,
                // Mock route for MILEAGE method with MFU Chiang Rai Coordinates
                route: method === 'MILEAGE' ? [
                    { name: 'M-Square Entrance', lat: 20.0450, lng: 99.8930 },
                    { name: 'E3 Academic Center', lat: 20.0465, lng: 99.8945 },
                    { name: 'C1 Dormitories', lat: 20.0480, lng: 99.8960 },
                    { name: 'University Stadium', lat: 20.0495, lng: 99.8975 }
                ] : null
            };
            set(state => ({
                activeRentals: [...state.activeRentals, newRental],
                bikes: state.bikes.map(b => b.id === bikeId ? { ...b, status: 'RENTED' } : b),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to rent bike', loading: false });
            return false;
        }
    },

    returnBike: async (rentalId, paymentDetails, finalLat, finalLng) => {
        set({ loading: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const rental = useBikeStore.getState().activeRentals.find(r => r.id === rentalId);
            const historyItem = {
                id: rental.id,
                bikeId: rental.bikeId,
                bikeName: rental.bikeName,
                date: new Date().toISOString().split('T')[0],
                duration: '1h 20m', // Mock duration calculation
                totalCost: rental.currentCost
            };
            set(state => ({
                activeRentals: state.activeRentals.filter(r => r.id !== rentalId),
                rentalHistory: [historyItem, ...state.rentalHistory],
                bikes: state.bikes.map(b => b.id === rental.bikeId ? {
                    ...b,
                    status: 'AVAILABLE',
                    // Update location if coordinates were provided
                    location: (finalLat && finalLng)
                        ? { ...b.location, lat: finalLat, lng: finalLng, zone: 'Last Parked Location' }
                        : b.location
                } : b),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to return bike', loading: false });
            return false;
        }
    },

    addBike: async (bikeData) => {
        set({ loading: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newBike = {
                ...bikeData,
                id: Math.max(...mockBikes.map(b => b.id), 0) + Math.floor(Math.random() * 1000) + 7
            };
            set((state) => ({
                bikes: [...state.bikes, newBike],
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to add bike', loading: false });
            return false;
        }
    },

    updateBike: async (id, bikeData) => {
        set({ loading: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set((state) => ({
                bikes: state.bikes.map(b => b.id === id ? { ...b, ...bikeData } : b),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to update bike', loading: false });
            return false;
        }
    },

    deleteBike: async (id) => {
        set({ loading: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set((state) => ({
                bikes: state.bikes.filter((bike) => bike.id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to delete bike', loading: false });
            return false;
        }
    },
}));

export default useBikeStore;
