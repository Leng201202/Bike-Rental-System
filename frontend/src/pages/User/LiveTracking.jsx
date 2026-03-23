import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import useBikeStore from '../../store/useBikeStore';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Bike Icon
const bikeIcon = new L.DivIcon({
    className: 'custom-bike-icon',
    html: `<div class="relative">
            <div class="absolute inset-0 w-12 h-12 bg-blue-500/20 rounded-full animate-ping -m-4"></div>
            <div class="relative bg-white border-2 border-blue-500 p-2 rounded-full shadow-2xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

// Component to handle map centering
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 15);
        }
    }, [lat, lng, map]);
    return null;
};

const LiveTracking = () => {
    const { activeRentals } = useBikeStore();
    const [selectedBike, setSelectedBike] = useState(null);
    const [userLoc, setUserLoc] = useState(null);
    const [locationGranted, setLocationGranted] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Watch user's live location
    useEffect(() => {
        if (!("geolocation" in navigator) || !locationGranted) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setUserLoc({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.log("Live tracking error:", error),
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [locationGranted]);

    const requestLocationAccess = () => {
        setLocationError(null);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationGranted(true);
                    setUserLoc({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("GPS Access Denied:", error);
                    setLocationError("Location access denied. Map will run in static mode.");
                    setLocationGranted(true); // Proceed to map but in static mode
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser.");
            setLocationGranted(true);
        }
    };

    useEffect(() => {
        if (activeRentals.length > 0 && !selectedBike) {
            setSelectedBike(activeRentals[0]);
        }
    }, [activeRentals, selectedBike]);

    return (
        <div className="min-h-[calc(100vh-73px-5rem)] md:min-h-[calc(100vh-73px)] h-[calc(100vh-73px-5rem)] md:h-[calc(100vh-73px)] flex flex-col md:flex-row bg-[#080808] overflow-hidden">
            {/* Sidebar List */}
            <div className="w-full md:w-80 max-h-[35vh] md:max-h-none overflow-y-auto border-b md:border-b-0 md:border-r border-white/5 bg-gray-900/10 backdrop-blur-3xl p-4 md:p-6 flex flex-col z-20">
                <div className="mb-4 md:mb-10">
                    <div className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        Satellite Link Active
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Live Maps</h1>
                    <p className="text-gray-500 text-[10px] font-bold italic">Real-time GPS Telemetry</p>
                </div>

                <div className="flex-1 space-y-2 md:space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {activeRentals.length > 0 ? (
                        activeRentals.map(rental => (
                            <button
                                key={rental.id}
                                onClick={() => setSelectedBike(rental)}
                                className={`w-full p-4 rounded-3xl border-2 transition-all duration-500 text-left group ${selectedBike?.id === rental.id
                                    ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/10'
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-colors ${selectedBike?.id === rental.id ? 'border-blue-500' : 'border-gray-800'}`}>
                                        <img src={rental.bikeImage} alt={rental.bikeName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-black uppercase tracking-tight text-xs truncate ${selectedBike?.id === rental.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            {rental.bikeName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-3 bg-blue-500/50 rounded-full"></div>
                                                <div className="w-1 h-3 bg-blue-500/80 rounded-full"></div>
                                                <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                                            </div>
                                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Tracking...</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
                            <div className="text-5xl mb-6 opacity-20">🗺️</div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-8 leading-relaxed">
                                No fleet activity detected.<br />Start a rental to view your map.
                            </p>
                        </div>
                    )}
                </div>

                {selectedBike && (
                    <div className="mt-6 space-y-3">
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-5 rounded-[2rem] border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Battery</span>
                                <span className="text-green-500 font-black text-[10px]">84%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[84%]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Canvas */}
            <div className="flex-1 relative z-10 min-h-[50vh] md:min-h-0">
                <MapContainer
                    center={[20.0460, 99.8943]}
                    zoom={16}
                    className="w-full h-full"
                    zoomControl={false}
                >
                    {/* Google Maps Tile Layer */}
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        attribution='&copy; Google Maps'
                    />

                    {/* Pre-Permission Blur Overlay */}
                    {!locationGranted && (
                        <div className="absolute inset-0 z-[2000] backdrop-blur-xl bg-black/60 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                            <div className="bg-gray-900/90 border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-sm w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                    📍
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2">Enable Live Tracking</h3>
                                <p className="text-gray-400 text-xs font-bold leading-relaxed mb-8">
                                    We need access to your device's GPS to show your live location relative to the rented bikes.
                                </p>
                                <button
                                    onClick={requestLocationAccess}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Grant GPS Access
                                </button>
                                {locationError && (
                                    <p className="text-red-400 text-[10px] font-bold mt-4 animate-in slide-in-from-bottom-2">
                                        {locationError}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeRentals.map(rental => {
                        // If it's the selected bike and we have user bounds, show them the live location
                        const isLive = selectedBike?.id === rental.id && userLoc;
                        const displayLat = isLive ? userLoc.lat : rental.lat;
                        const displayLng = isLive ? userLoc.lng : rental.lng;

                        return (
                            <Marker
                                key={rental.id}
                                position={[displayLat, displayLng]}
                                icon={bikeIcon}
                                eventHandlers={{
                                    click: () => setSelectedBike(rental)
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-2 text-center">
                                        <div className="font-black uppercase text-[10px] mb-1 text-blue-500">{rental.bikeName}</div>
                                        <div className="text-[8px] font-bold text-gray-500 uppercase">
                                            {isLive ? 'Live GPS Telemetry' : 'Last Known Location'}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {selectedBike && (
                        <RecenterMap
                            lat={userLoc ? userLoc.lat : selectedBike.lat}
                            lng={userLoc ? userLoc.lng : selectedBike.lng}
                        />
                    )}
                </MapContainer>

                {/* Map HUD Elements */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col gap-2 md:gap-4 z-[1000]">
                    <div className="bg-black/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
                        <div className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">MFU Campus Grid</div>
                        <div className="text-xs font-bold text-white uppercase tracking-widest">Main Plaza // Zone B</div>
                        <div className="text-xs font-mono text-white mt-2">
                            LAT: {userLoc ? userLoc.lat.toFixed(4) : (selectedBike?.lat?.toFixed(4) || '---')}
                            <br />
                            LNG: {userLoc ? userLoc.lng.toFixed(4) : (selectedBike?.lng?.toFixed(4) || '---')}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-[1000] pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest pr-2">Live Stream</span>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(18, 18, 18, 0.95);
                    color: white;
                    border-radius: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                }
                .custom-popup .leaflet-popup-tip {
                    background: rgba(18, 18, 18, 0.95);
                }
                .leaflet-container {
                    background: #0a0a0a !important;
                }
            `}</style>
        </div>
    );
};

export default LiveTracking;
