import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Marker for start/end
const createHtmlIcon = (color, emoji) => new L.DivIcon({
    className: 'custom-checkpoint-icon',
    html: `<div class="bg-white border-2 border-${color}-400 w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const RouteMap = ({ route, className = "", isExpanded = false }) => {
    if (!route || route.length === 0) return null;

    // Convert route to LatLng pairs for Leaflet
    const positions = route.map(point => [point.lat, point.lng]);
    const center = positions[Math.floor(positions.length / 2)];

    return (
        <div className={`relative overflow-hidden bg-white rounded-2xl border border-[#E5E7EB] shadow-sm group transition-all duration-500 ${className} ${isExpanded ? 'h-96' : 'h-48'}`}>
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
                    color="#F2CACA"
                    weight={12}
                    opacity={0.5}
                />

                {/* The Path Trace - Core Highlight */}
                <Polyline
                    positions={positions}
                    color="#8B2E2E"
                    weight={4}
                    opacity={0.9}
                    dashArray="1, 10"
                    lineCap="round"
                    className="animate-pulse"
                />

                {/* The Path Trace - Solid Center */}
                <Polyline
                    positions={positions}
                    color="#A63A3A"
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
                <div className="absolute inset-0 bg-[#8B2E2E]/0 hover:bg-[#8B2E2E]/5 transition-colors cursor-pointer flex items-center justify-center group-hover:opacity-100 opacity-0 duration-300 z-[1000]">
                    <div className="bg-white/95 px-4 py-2 rounded-full border border-[#E5E7EB] text-[10px] font-semibold uppercase tracking-wide text-[#8B2E2E]">
                        Expand Course Map
                    </div>
                </div>
            )}

            {/* Map HUD for looks */}
            <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
                <div className="bg-white/95 px-3 py-1.5 rounded-md border border-[#F2CACA] text-[9px] font-semibold text-[#8B2E2E] uppercase tracking-wide">
                    Course Trace Enabled
                </div>
            </div>
        </div>
    );
};

export default RouteMap;
