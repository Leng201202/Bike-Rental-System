import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import useBikeStore from '../../store/useBikeStore';
import Card from '../../components/UI/Card';
import SafeBikeImage from '../../components/UI/SafeBikeImage';

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
    React.useEffect(() => {
        if (Array.isArray(center) && center.length === 2) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
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
                <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">Live Fleet Tracking</h1>
                <p className="text-[#6B7280] font-medium">Mae Fah Luang University - Real-time GPS oversight.</p>
            </header>

            <div className="flex-1 flex gap-8 min-h-[600px] mb-8">
                {/* Map View */}
                <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl relative overflow-hidden shadow-sm z-0">
                    <MapContainer
                        center={mfuCenter}
                        zoom={16}
                        style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />

                        {selectedBike?.location?.lat && selectedBike?.location?.lng && (
                            <ChangeView center={[selectedBike.location.lat, selectedBike.location.lng]} zoom={18} />
                        )}

                        {bikes.filter((bike) => bike?.location?.lat && bike?.location?.lng).map((bike) => (
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
                                            <SafeBikeImage bike={bike} className="w-10 h-10 rounded-lg object-cover" alt={bike.name} />
                                            <div>
                                                <div className="font-semibold text-xs text-[#2F2F2F]">{bike.name}</div>
                                                <div className="text-[10px] text-[#8B2E2E] font-semibold tracking-wide">{bike.status}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-[#6B7280] font-medium">Zone: {bike.location.zone}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Map UI Overlays */}
                    <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
                        <div className="px-4 py-2 bg-white/95 rounded-md border border-[#E5E7EB] text-[10px] font-semibold uppercase text-[#8B2E2E] tracking-wide shadow-sm">
                            MFU CAMPUS ONLINE
                        </div>
                    </div>
                </div>

                {/* Bike List Sidebar */}
                <div className="w-80 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col !p-0 overflow-hidden">
                        <div className="p-6 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8B2E2E]">Bike Inventory</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                            {bikes.map(bike => (
                                <button
                                    key={bike.id}
                                    onClick={() => setSelectedBike(bike)}
                                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${selectedBike?.id === bike.id
                                            ? 'bg-[#FCEAEA] border-[#8B2E2E]'
                                            : 'bg-white border-[#E5E7EB] hover:bg-[#FCFCFC]'
                                        }`}
                                >
                                    <div>
                                        <div className={`text-xs font-semibold transition-colors ${selectedBike?.id === bike.id ? 'text-[#8B2E2E]' : 'text-[#2F2F2F]'}`}>
                                            {bike.name}
                                        </div>
                                        <div className={`text-[10px] font-medium ${selectedBike?.id === bike.id ? 'text-[#8B2E2E]' : 'text-[#6B7280]'}`}>
                                            {bike.location.zone}
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${bike.status === 'AVAILABLE' ? 'bg-green-500' :
                                            bike.status === 'RENTED' ? 'bg-[#8B2E2E]' : 'bg-gray-500'
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
