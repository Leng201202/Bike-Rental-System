import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import useBikeStore from "../../store/useBikeStore";
import RouteToBike from "./RouteToBike";
import SafeBikeImage from "../../components/UI/SafeBikeImage";
import { getBikeImageUrl } from "../../utils/bikeData";

const isValidCoordinate = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!isValidCoordinate(lat1, lng1) || !isValidCoordinate(lat2, lng2)) {
    return null;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const formatDistance = (distanceInMeters) => {
  if (!Number.isFinite(distanceInMeters)) return null;
  if (distanceInMeters < 1000) return `${Math.round(distanceInMeters)} m away`;
  return `${(distanceInMeters / 1000).toFixed(2)} km away`;
};

const formatTravelTime = (durationInSeconds) => {
  if (!Number.isFinite(durationInSeconds)) return null;
  const minutes = Math.round(durationInSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Bike Icon
const bikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative">
            <div class="absolute inset-0 w-12 h-12 bg-blue-500/20 rounded-full animate-ping -m-4"></div>
            <div class="relative bg-white border-2 border-blue-500 p-2 rounded-full shadow-2xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const availableBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative opacity-95">
            <div class="relative bg-white border-2 border-emerald-500 p-2 rounded-full shadow-xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const maintenanceBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative opacity-75 grayscale">
            <div class="relative bg-zinc-200 border-2 border-rose-500 p-2 rounded-full shadow-lg flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const selectedActiveBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative">
            <div class="absolute inset-0 w-14 h-14 bg-cyan-400/25 rounded-full -m-5 animate-pulse"></div>
            <div class="relative bg-white border-2 border-cyan-300 p-2 rounded-full shadow-2xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const selectedAvailableBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative">
            <div class="absolute inset-0 w-12 h-12 bg-emerald-400/20 rounded-full -m-4"></div>
            <div class="relative bg-white border-2 border-cyan-300 p-2 rounded-full shadow-2xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const selectedMaintenanceBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative opacity-85">
            <div class="absolute inset-0 w-12 h-12 bg-zinc-400/20 rounded-full -m-4"></div>
            <div class="relative bg-zinc-200 border-2 border-cyan-300 p-2 rounded-full shadow-xl flex items-center justify-center text-xl grayscale">🚲</div>
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
  const { activeRentals, bikes } = useBikeStore();
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedMapBikeId, setSelectedMapBikeId] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const hasAutoFocusedNearest = useRef(false);

  const trackableRentals = useMemo(
    () => activeRentals.filter((rental) => rental.status === "ACTIVE"),
    [activeRentals],
  );

  const nearestBikeData = useMemo(() => {
    if (!userLoc || trackableRentals.length === 0) return null;

    let nearest = null;
    for (const rental of trackableRentals) {
      const distance = calculateDistance(
        userLoc.lat,
        userLoc.lng,
        rental.lat,
        rental.lng,
      );

      if (distance === null) continue;
      if (!nearest || distance < nearest.distance) {
        nearest = { bike: rental, distance };
      }
    }

    return nearest;
  }, [trackableRentals, userLoc]);

  const selectedActiveBike = useMemo(() => {
    if (
      selectedBike &&
      trackableRentals.some((rental) => rental.id === selectedBike.id)
    ) {
      return selectedBike;
    }

    return trackableRentals[0] || null;
  }, [selectedBike, trackableRentals]);

  const findNearestRentalFromLocation = useCallback(
    (location) => {
      if (!location || trackableRentals.length === 0) return null;

      let nearest = null;
      for (const rental of trackableRentals) {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          rental.lat,
          rental.lng,
        );

        if (distance === null) continue;
        if (!nearest || distance < nearest.distance) {
          nearest = { bike: rental, distance };
        }
      }

      return nearest?.bike || null;
    },
    [trackableRentals],
  );

  const mapBikes = useMemo(() => {
    const activeByBikeId = new Map(
      trackableRentals.map((rental) => [rental.bikeId, rental]),
    );

    const normalizedFromBikes = bikes
      .map((bike) => {
        const activeRental = activeByBikeId.get(bike.id);
        const rawStatus = String(bike.status || "").toUpperCase();
        const isMaintenance = rawStatus === "MAINTENANCE";
        const isActive = Boolean(activeRental) || rawStatus === "ACTIVE";
        const status = isMaintenance
          ? "MAINTENANCE"
          : isActive
            ? "ACTIVE"
            : "AVAILABLE";

        return {
          id: `bike-${bike.id}`,
          bikeId: bike.id,
          status,
          bikeName: bike.name || `Bike #${bike.id}`,
          bikeImage: getBikeImageUrl(bike),
          lat: activeRental?.lat ?? bike.location?.lat,
          lng: activeRental?.lng ?? bike.location?.lng,
          activeRental,
        };
      })
      .filter((bike) => isValidCoordinate(bike.lat, bike.lng));

    for (const rental of trackableRentals) {
      const exists = normalizedFromBikes.some((bike) => bike.bikeId === rental.bikeId);
      if (exists || !isValidCoordinate(rental.lat, rental.lng)) continue;

      normalizedFromBikes.push({
        id: `active-${rental.id}`,
        bikeId: rental.bikeId,
        status: "ACTIVE",
        bikeName: rental.bikeName || `Bike #${rental.bikeId}`,
        bikeImage: getBikeImageUrl(rental),
        lat: rental.lat,
        lng: rental.lng,
        activeRental: rental,
      });
    }

    return normalizedFromBikes;
  }, [bikes, trackableRentals]);

  const visibleMapBikes = useMemo(
    () => mapBikes.filter((bike) => bike.status === "AVAILABLE"),
    [mapBikes],
  );

  const selectedMapBike = useMemo(() => {
    if (selectedMapBikeId !== null) {
      const explicitSelection = mapBikes.find(
        (bike) => bike.bikeId === selectedMapBikeId,
      );
      if (explicitSelection) return explicitSelection;
    }

    if (selectedActiveBike) {
      return (
        mapBikes.find((bike) => bike.bikeId === selectedActiveBike.bikeId) ||
        null
      );
    }

    return null;
  }, [mapBikes, selectedActiveBike, selectedMapBikeId]);

  // Watch user's live location
  useEffect(() => {
    if (!("geolocation" in navigator) || !locationGranted) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextUserLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLoc(nextUserLoc);

        if (!hasAutoFocusedNearest.current) {
          const nearestRental = findNearestRentalFromLocation(nextUserLoc);
          if (nearestRental) {
            setSelectedBike(nearestRental);
            setSelectedMapBikeId(nearestRental.bikeId);
            hasAutoFocusedNearest.current = true;
          }
        }
      },
      (error) => console.log("Live tracking error:", error),
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [findNearestRentalFromLocation, locationGranted]);

  const requestLocationAccess = () => {
    setLocationError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextUserLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setLocationGranted(true);
          setUserLoc(nextUserLoc);

          if (!hasAutoFocusedNearest.current) {
            const nearestRental = findNearestRentalFromLocation(nextUserLoc);
            if (nearestRental) {
              setSelectedBike(nearestRental);
              setSelectedMapBikeId(nearestRental.bikeId);
              hasAutoFocusedNearest.current = true;
            }
          }
        },
        (error) => {
          console.error("GPS Access Denied:", error);
          setLocationError(
            "Location access denied. Map will run in static mode.",
          );
          setLocationGranted(true); // Proceed to map but in static mode
        },
        { enableHighAccuracy: true },
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationGranted(true);
    }
  };

  const routeTarget = useMemo(() => {
    if (
      !selectedMapBike ||
      selectedMapBike.status !== "AVAILABLE" ||
      !isValidCoordinate(selectedMapBike.lat, selectedMapBike.lng)
    ) {
      return null;
    }

    return {
      bikeId: selectedMapBike.bikeId,
      bikeName: selectedMapBike.bikeName,
      lat: selectedMapBike.lat,
      lng: selectedMapBike.lng,
      status: selectedMapBike.status,
    };
  }, [selectedMapBike]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    mapBikes.forEach((bike) => {
      console.log("Bike image:", bike.bikeImage, "Bike:", bike.bikeName);
    });
  }, [mapBikes]);

  return (
    <div className="min-h-[calc(100vh-73px)] h-[calc(100vh-73px)] flex flex-col md:flex-row bg-[#080808] overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-80 border-r border-white/5 bg-gray-900/10 backdrop-blur-3xl p-6 flex flex-col z-20">
        <div className="mb-10">
          <div className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Satellite Link Active
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Live Maps
          </h1>
          <p className="text-gray-500 text-[10px] font-bold italic">
            Real-time GPS Telemetry
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {mapBikes.length > 0 ? (
            mapBikes.map((bike) => {
              const isActiveBike = bike.status === "ACTIVE";
              const isSelected = selectedMapBike?.bikeId === bike.bikeId;
              const isNearestBike =
                isActiveBike &&
                bike.activeRental &&
                nearestBikeData?.bike?.id === bike.activeRental.id;
              const statusLabel =
                bike.status === "MAINTENANCE"
                  ? "In Maintenance"
                  : isActiveBike
                    ? "Active Ride"
                    : "Available";
              const statusClass =
                bike.status === "MAINTENANCE"
                  ? "bg-rose-500/15 text-rose-300 border border-rose-400/40"
                  : isActiveBike
                    ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40";

              return (
              <button
                key={bike.id}
                onClick={() => {
                  setSelectedMapBikeId(bike.bikeId);
                  setSelectedBike(bike.activeRental || null);
                }}
                className={`w-full p-4 rounded-3xl border-2 transition-all duration-500 text-left group ${
                  isSelected
                    ? "bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/10"
                    : "bg-white/5 border-transparent hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-colors ${isSelected ? "border-blue-500" : "border-gray-800"}`}
                  >
                    <SafeBikeImage
                      bike={bike}
                      src={bike.bikeImage}
                      alt={bike.bikeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-black uppercase tracking-tight text-xs truncate ${isSelected ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                      >
                        {bike.bikeName}
                      </h3>
                      {isNearestBike && (
                        <span className="shrink-0 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/40">
                          Nearest Bike
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                      {isActiveBike && (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-3 bg-blue-500/50 rounded-full"></div>
                            <div className="w-1 h-3 bg-blue-500/80 rounded-full"></div>
                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">
                            Tracking...
                          </span>
                        </>
                      )}
                    </div>
                    {isNearestBike && (
                      <p className="mt-1 text-[9px] font-bold text-blue-200 uppercase tracking-wide">
                        {formatDistance(nearestBikeData.distance)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
              <div className="text-5xl mb-6 opacity-20">🗺️</div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-8 leading-relaxed">
                No bikes detected.
                <br />
                Add or fetch bikes to view live map data.
              </p>
            </div>
          )}
        </div>

        {selectedActiveBike && (
          <div className="mt-6 space-y-3">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-5 rounded-[2rem] border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  Battery
                </span>
                <span className="text-green-500 font-black text-[10px]">
                  84%
                </span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[84%]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative z-10">
        <MapContainer
          center={[20.046, 99.8943]}
          zoom={16}
          className="w-full h-full"
          zoomControl={false}
        >
          {/* Google Maps Tile Layer */}
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />

          {/* Pre-Permission Blur Overlay */}
          {!locationGranted && (
            <div className="absolute inset-0 z-[2000] backdrop-blur-xl bg-black/60 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-gray-900/90 border border-white/10 p-8 rounded-[3rem] shadow-2xl max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  📍
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                  Enable Live Tracking
                </h3>
                <p className="text-gray-400 text-xs font-bold leading-relaxed mb-8">
                  We need access to your device's GPS to show your live location
                  relative to the rented bikes.
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

          {routeTarget && userLoc && (
            <RouteToBike
              userLoc={userLoc}
              destination={routeTarget}
              onRouteInfoChange={setRouteInfo}
            />
          )}

          {visibleMapBikes.map((bike) => {
            const isActiveBike = bike.status === "ACTIVE";
            const activeRental = bike.activeRental;
            const isLive =
              isActiveBike &&
              activeRental &&
              selectedActiveBike?.id === activeRental.id &&
              userLoc;
            const displayLat = isLive ? userLoc.lat : bike.lat;
            const displayLng = isLive ? userLoc.lng : bike.lng;
            const isNearestBike =
              isActiveBike && activeRental && nearestBikeData?.bike?.id === activeRental.id;
            const nearestDistanceLabel = isNearestBike
              ? formatDistance(nearestBikeData.distance)
              : null;
            const isSelectedMapBike = selectedMapBike?.bikeId === bike.bikeId;
            const icon =
              bike.status === "MAINTENANCE"
                ? isSelectedMapBike
                  ? selectedMaintenanceBikeIcon
                  : maintenanceBikeIcon
                : isActiveBike
                  ? isSelectedMapBike
                    ? selectedActiveBikeIcon
                    : bikeIcon
                  : isSelectedMapBike
                    ? selectedAvailableBikeIcon
                    : availableBikeIcon;
            const statusLabel =
              bike.status === "MAINTENANCE"
                ? "In Maintenance"
                : isActiveBike
                  ? "Active Ride"
                  : "Available";
            const statusBadgeClass =
              bike.status === "MAINTENANCE"
                ? "bg-rose-500/15 text-rose-300 border border-rose-400/40"
                : isActiveBike
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40";

            return (
              <Marker
                key={bike.id}
                position={[displayLat, displayLng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedMapBikeId(bike.bikeId);
                    if (activeRental) setSelectedBike(activeRental);
                  },
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-center">
                    <div className="font-black uppercase text-[10px] mb-1 text-blue-500">
                      {bike.bikeName}
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${statusBadgeClass}`}
                    >
                      {statusLabel}
                    </div>
                    <div className="text-[8px] font-bold text-gray-500 uppercase mt-2">
                      {isActiveBike
                        ? isLive
                          ? "Live GPS Telemetry"
                          : "Last Known Location"
                        : statusLabel}
                    </div>
                    {isNearestBike && (
                      <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-blue-300">
                        Nearest Bike
                        {nearestDistanceLabel ? ` | ${nearestDistanceLabel}` : ""}
                      </div>
                    )}
                    {isSelectedMapBike && routeInfo && (
                      <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-cyan-300">
                        {routeInfo.error
                          ? routeInfo.error
                          : `${routeInfo.label || "Shortest Route"}: ${formatDistance(routeInfo.distance)} | ${formatTravelTime(routeInfo.duration)}`}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {selectedMapBike && (
            <RecenterMap
              lat={selectedMapBike.lat}
              lng={selectedMapBike.lng}
            />
          )}
        </MapContainer>

        {/* Map HUD Elements */}
        <div className="absolute top-8 right-8 flex flex-col gap-4 z-[1000]">
          <div className="bg-black/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
              MFU Campus Grid
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-widest">
              Main Plaza // Zone B
            </div>
            <div className="text-xs font-mono text-white mt-2">
              LAT:{" "}
              {userLoc
                ? userLoc.lat.toFixed(4)
                : selectedActiveBike?.lat?.toFixed(4) || "---"}
              <br />
              LNG:{" "}
              {userLoc
                ? userLoc.lng.toFixed(4)
                : selectedActiveBike?.lng?.toFixed(4) || "---"}
            </div>
          </div>

          {routeTarget && routeInfo && (
            <div className="bg-black/80 backdrop-blur-xl p-4 rounded-3xl border border-cyan-400/20 shadow-2xl">
              <div className="text-[8px] font-black text-cyan-300 uppercase tracking-[0.2em] mb-1">
                {routeInfo.label || "Shortest Route"}
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-widest truncate">
                {routeTarget.bikeName}
              </div>
              {routeInfo.error ? (
                <div className="text-[10px] font-black text-rose-300 uppercase tracking-widest mt-2">
                  {routeInfo.error}
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-black text-cyan-200 uppercase tracking-widest mt-2">
                    {formatDistance(routeInfo.distance)}
                  </div>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">
                    {formatTravelTime(routeInfo.duration)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-10 left-10 z-[1000] pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest pr-2">
              Live Stream
            </span>
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
