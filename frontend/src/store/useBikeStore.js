import { create } from 'zustand';
import api from '../api/api';

const mockBikes = [
    { id: 1, name: 'Mountain Explorer X1', type: 'MOUNTAIN', status: 'AVAILABLE', pricePerHour: 5.5, imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ee05051da69?auto=format&fit=crop&q=80&w=800', description: 'Rugged and reliable for off-road campus trails.' },
    { id: 2, name: 'City Cruiser v2', type: 'ROAD', status: 'RENTED', pricePerHour: 3.5, imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800', description: 'The perfect companion for a smooth cross-campus commute.' },
    { id: 3, name: 'Electric Spark S5', type: 'ELECTRIC', status: 'AVAILABLE', pricePerHour: 8.0, imageUrl: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=800', description: 'Get there faster with zero effort and maximum style.' },
    { id: 4, name: 'Road Master Pro', type: 'ROAD', status: 'AVAILABLE', pricePerHour: 4.5, imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=800', description: 'Lightweight frame for high-speed campus travel.' },
    { id: 5, name: 'Trail Blazer', type: 'MOUNTAIN', status: 'AVAILABLE', pricePerHour: 6.0, imageUrl: 'https://images.unsplash.com/photo-1544191696-102dbdaeeec6?auto=format&fit=crop&q=80&w=800', description: 'Tackle any terrain with advanced suspension.' },
    { id: 6, name: 'Urban Glide', type: 'CITY', status: 'MAINTENANCE', pricePerHour: 3.0, imageUrl: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&q=80&w=800', description: 'Simple, elegant, and ready for the city streets.' },
];

const useBikeStore = create((set) => ({
    bikes: mockBikes,
    loading: false,
    error: null,

    fetchBikes: async () => {
        set({ loading: true, error: null });
        try {
            // Mocking fetch delay
            await new Promise(resolve => setTimeout(resolve, 800));
            set({ bikes: mockBikes, loading: false });
        } catch (error) {
            set({
                error: 'Failed to fetch bikes',
                loading: false
            });
        }
    },

    addBike: async (bikeData) => {
        set({ loading: true });
        try {
            const response = await api.post('/bikes', bikeData);
            set((state) => ({
                bikes: [...state.bikes, response.data],
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to add bike', loading: false });
            return false;
        }
    },

    deleteBike: async (id) => {
        try {
            await api.delete(`/bikes/${id}`);
            set((state) => ({
                bikes: state.bikes.filter((bike) => bike.id !== id),
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to delete bike' });
            return false;
        }
    },
}));

export default useBikeStore;
