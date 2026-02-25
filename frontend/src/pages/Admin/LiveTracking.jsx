import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import useBikeStore from '../../store/useBikeStore';
import Card from '../../components/UI/Card';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map center changes
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const LiveTracking = () => {
    const { bikes } = useBikeStore();
    const [selectedBike, setSelectedBike] = useState(null);
    const mfuCenter = [20.0461, 99.8949];

    // Custom Marker Icon based on status
    const getBikeIcon = (status, bikeId) => {
        const color = status === 'AVAILABLE' ? '#10b981' : status === 'RENTED' ? '#3b82f6' : '#6b7280';
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="relative flex items-center justify-center">
                    ${status === 'RENTED' ? '<div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 scale-150"></div>' : ''}
                    <div style="background-color: ${color};" class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-xl z-10 transform hover:scale-110 transition-transform">
                        <span class="text-[10px] font-black text-white">#${bikeId}</span>
                    </div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Live Fleet Tracking</h1>
                <p className="text-gray-400 font-medium">Mae Fah Luang University - Real-time GPS Oversight.</p>
            </header>

            <div className="flex-1 flex gap-8 min-h-[600px] mb-8">
                {/* Map View */}
                <div className="flex-1 bg-gray-900/40 border border-gray-700/30 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl shadow-2xl z-0">
                    <MapContainer
                        center={mfuCenter}
                        zoom={16}
                        style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {selectedBike && (
                            <ChangeView center={[selectedBike.location.lat, selectedBike.location.lng]} zoom={18} />
                        )}

                        {bikes.map((bike) => (
                            <Marker
                                key={bike.id}
                                position={[bike.location.lat, bike.location.lng]}
                                icon={getBikeIcon(bike.status, bike.id)}
                                eventHandlers={{
                                    click: () => setSelectedBike(bike),
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-2 min-w-[150px]">
                                        <div className="flex gap-3 mb-2">
                                            <img src={bike.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                            <div>
                                                <div className="font-black text-xs uppercase">{bike.name}</div>
                                                <div className="text-[10px] text-blue-500 font-bold tracking-widest">{bike.status}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-medium">Zone: {bike.location.zone}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Map UI Overlays */}
                    <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
                        <div className="px-4 py-2 bg-gray-900/80 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase text-white tracking-widest">
                            MFU CAMPUS ONLINE
                        </div>
                    </div>
                </div>

                {/* Bike List Sidebar */}
                <div className="w-80 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col !p-0 overflow-hidden">
                        <div className="p-6 border-b border-gray-700/50 bg-black/10">
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Bike Inventory</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                            {bikes.map(bike => (
                                <button
                                    key={bike.id}
                                    onClick={() => setSelectedBike(bike)}
                                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${selectedBike?.id === bike.id
                                            ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'bg-white/5 border-gray-700/30 hover:bg-white/10'
                                        }`}
                                >
                                    <div>
                                        <div className={`text-xs font-black uppercase transition-colors ${selectedBike?.id === bike.id ? 'text-white' : 'text-gray-300'}`}>
                                            {bike.name}
                                        </div>
                                        <div className={`text-[10px] font-bold ${selectedBike?.id === bike.id ? 'text-blue-200' : 'text-gray-500'}`}>
                                            {bike.location.zone}
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${bike.status === 'AVAILABLE' ? 'bg-green-500' :
                                            bike.status === 'RENTED' ? 'bg-blue-400' : 'bg-gray-600'
                                        }`}></div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
