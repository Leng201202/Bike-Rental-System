import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Marker for start/end
const createHtmlIcon = (color, emoji) => new L.DivIcon({
    className: 'custom-checkpoint-icon',
    html: `<div class="bg-white border-2 border-${color}-500 w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-sm">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const RouteMap = ({ route, className = "", isExpanded = false }) => {
    if (!route || route.length === 0) return null;

    // Convert route to LatLng pairs for Leaflet
    const positions = route.map(point => [point.lat, point.lng]);
    const center = positions[Math.floor(positions.length / 2)];

    return (
        <div className={`relative overflow-hidden bg-[#1a1a1a] rounded-[2rem] border border-gray-800 shadow-inner group transition-all duration-500 ${className} ${isExpanded ? 'h-96' : 'h-48'}`}>
            <MapContainer
                center={center}
                zoom={14}
                className="w-full h-full pointer-events-none"
                zoomControl={false}
                attributionControl={false}
            >
                {/* Google Maps Tile Layer */}
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                />

                {/* The Path Trace - Outer Glow */}
                <Polyline
                    positions={positions}
                    color="#3b82f6"
                    weight={12}
                    opacity={0.15}
                />

                {/* The Path Trace - Core Highlight */}
                <Polyline
                    positions={positions}
                    color="#3b82f6"
                    weight={4}
                    opacity={0.9}
                    dashArray="1, 10"
                    lineCap="round"
                    className="animate-pulse"
                />

                {/* The Path Trace - Solid Center */}
                <Polyline
                    positions={positions}
                    color="#60a5fa"
                    weight={1.5}
                    opacity={1}
                />

                {/* Start Marker */}
                <Marker position={positions[0]} icon={createHtmlIcon('green', '🚩')} />

                {/* End Marker */}
                <Marker position={positions[positions.length - 1]} icon={createHtmlIcon('blue', '🏁')} />

                {/* Middle Checkpoints (only if expanded) */}
                {isExpanded && route.slice(1, -1).map((point, idx) => (
                    <Marker key={idx} position={[point.lat, point.lng]} icon={createHtmlIcon('gray', '📍')}>
                        <Popup>{point.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Glassmorphic Overlay for "Realness" */}
            {!isExpanded && (
                <div className="absolute inset-0 bg-blue-500/0 hover:bg-blue-500/5 transition-colors cursor-pointer flex items-center justify-center group-hover:opacity-100 opacity-0 duration-300 z-[1000]">
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        Expand Course Map
                    </div>
                </div>
            )}

            {/* Map HUD for looks */}
            <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                    Course Trace Enabled
                </div>
            </div>
        </div>
    );
};

export default RouteMap;
