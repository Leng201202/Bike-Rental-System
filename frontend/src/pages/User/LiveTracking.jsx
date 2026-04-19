import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

const getRideTrackStorageKey = (rentalId) => `ride-gps-track-${rentalId}`;
const MIN_TRACKING_DISTANCE_METERS = 5;
const MIN_TRACKING_INTERVAL_MS = 5000;

const readRideTrack = (rentalId) => {
  if (!rentalId) return [];
  try {
    const raw = localStorage.getItem(getRideTrackStorageKey(rentalId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((point) => [Number(point?.lat), Number(point?.lng)])
      .filter(([lat, lng]) => isValidCoordinate(lat, lng));
  } catch {
    return [];
  }
};

const saveRideTrackPoint = (rentalId, point) => {
  if (!rentalId || !isValidCoordinate(point?.lat, point?.lng)) return;

  try {
    const key = getRideTrackStorageKey(rentalId);
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    const points = Array.isArray(parsed) ? parsed : [];
    const lastPoint = points[points.length - 1];

    if (lastPoint) {
      const lastTimestamp = Number(lastPoint.timestamp || 0);
      const nowTimestamp = Number(point.timestamp || 0);
      const timeDelta = nowTimestamp - lastTimestamp;
      const distanceDelta = calculateDistance(lastPoint.lat, lastPoint.lng, point.lat, point.lng) || 0;
      if (timeDelta < MIN_TRACKING_INTERVAL_MS && distanceDelta < MIN_TRACKING_DISTANCE_METERS) {
        return;
      }
    }

    const nextPoints = [...points, point].slice(-1500);
    localStorage.setItem(key, JSON.stringify(nextPoints));
  } catch {
    // Ignore storage errors so tracking UI remains usable.
  }
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
            <div class="absolute inset-0 w-12 h-12 bg-[#8B2E2E]/20 rounded-full animate-ping -m-4"></div>
            <div class="relative bg-white border-2 border-[#8B2E2E] p-2 rounded-full shadow-xl flex items-center justify-center text-xl">🚲</div>
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
            <div class="absolute inset-0 w-14 h-14 bg-[#8B2E2E]/20 rounded-full -m-5 animate-pulse"></div>
            <div class="relative bg-white border-2 border-[#8B2E2E] p-2 rounded-full shadow-2xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const selectedAvailableBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative">
            <div class="absolute inset-0 w-12 h-12 bg-emerald-400/20 rounded-full -m-4"></div>
            <div class="relative bg-white border-2 border-[#8B2E2E] p-2 rounded-full shadow-2xl flex items-center justify-center text-xl">🚲</div>
           </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const selectedMaintenanceBikeIcon = new L.DivIcon({
  className: "custom-bike-icon",
  html: `<div class="relative opacity-85">
            <div class="absolute inset-0 w-12 h-12 bg-zinc-400/20 rounded-full -m-4"></div>
            <div class="relative bg-zinc-200 border-2 border-[#8B2E2E] p-2 rounded-full shadow-xl flex items-center justify-center text-xl grayscale">🚲</div>
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
  const { activeRentals, bikes, fetchBikes } = useBikeStore();
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedMapBikeId, setSelectedMapBikeId] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const hasAutoFocusedNearest = useRef(false);
  const trackedRentalIdRef = useRef(null);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

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

  useEffect(() => {
    const nextRentalId = selectedActiveBike?.id || null;
    if (!nextRentalId || trackedRentalIdRef.current === nextRentalId) return;

    trackedRentalIdRef.current = nextRentalId;
    if (userLoc) {
      saveRideTrackPoint(nextRentalId, {
        lat: userLoc.lat,
        lng: userLoc.lng,
        timestamp: Date.now(),
      });
    }
  }, [selectedActiveBike, userLoc]);

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
          zone: activeRental?.zone || bike.location?.zone || "Unknown Zone",
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
        zone: rental.zone || "Unknown Zone",
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

  const activeRideTrail = useMemo(() => {
    if (!selectedActiveBike?.id) return [];

    const trail = readRideTrack(selectedActiveBike.id);
    if (!userLoc) return trail;

    const lastPoint = trail[trail.length - 1];
    if (!lastPoint) {
      return [[userLoc.lat, userLoc.lng]];
    }

    const [lastLat, lastLng] = lastPoint;
    if (lastLat === userLoc.lat && lastLng === userLoc.lng) {
      return trail;
    }

    return [...trail, [userLoc.lat, userLoc.lng]];
  }, [selectedActiveBike, userLoc]);

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

        if (selectedActiveBike?.id) {
          saveRideTrackPoint(selectedActiveBike.id, {
            lat: nextUserLoc.lat,
            lng: nextUserLoc.lng,
            timestamp: Date.now(),
          });
        }

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
  }, [findNearestRentalFromLocation, locationGranted, selectedActiveBike]);

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

  const currentZoneLabel = useMemo(() => {
    const candidates = [
      selectedMapBike?.zone,
      selectedActiveBike?.zone,
      nearestBikeData?.bike?.zone,
    ];

    const resolved = candidates.find(
      (zone) => typeof zone === "string" && zone.trim().length > 0,
    );
    return resolved || "Unknown Zone";
  }, [nearestBikeData, selectedActiveBike, selectedMapBike]);

  return (
    <div className="min-h-[calc(100vh-140px)] h-[calc(100vh-140px)] md:min-h-[calc(100vh-73px)] md:h-[calc(100vh-73px)] flex flex-col md:flex-row bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar List */}
      <div className="hidden md:flex w-full md:w-80 border-r border-[#E5E7EB] bg-white p-6 flex-col z-20">
        <div className="mb-10">
          <div className="text-[10px] font-bold uppercase text-[#8B2E2E] tracking-[0.24em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#8B2E2E] rounded-full animate-pulse"></span>
            Live GPS Ready
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#2F2F2F]">
            Campus Map
          </h1>
          <p className="text-[#6B7280] text-xs font-medium mt-1">
            Track your active ride and nearby bikes in real time.
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
                  ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]"
                  : isActiveBike
                    ? "bg-[#FCEAEA] text-[#8B2E2E] border border-[#F2CACA]"
                    : "bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]";

              return (
              <button
                key={bike.id}
                onClick={() => {
                  setSelectedMapBikeId(bike.bikeId);
                  setSelectedBike(bike.activeRental || null);
                }}
                className={`w-full p-4 rounded-3xl border-2 transition-all duration-500 text-left group ${
                  isSelected
                    ? "bg-[#FCEAEA] border-[#8B2E2E]/40 shadow-sm"
                    : "bg-[#F9FAFB] border-transparent hover:bg-[#F3F4F6]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl overflow-hidden border transition-colors ${isSelected ? "border-[#8B2E2E]" : "border-[#E5E7EB]"}`}
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
                        className={`font-semibold tracking-tight text-sm truncate ${isSelected ? "text-[#2F2F2F]" : "text-[#4B5563] group-hover:text-[#2F2F2F]"}`}
                      >
                        {bike.bikeName}
                      </h3>
                      {isNearestBike && (
                        <span className="shrink-0 px-2 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wide bg-[#FCEAEA] text-[#8B2E2E] border border-[#F2CACA]">
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
                            <div className="w-1 h-3 bg-[#8B2E2E]/40 rounded-full"></div>
                            <div className="w-1 h-3 bg-[#8B2E2E]/70 rounded-full"></div>
                            <div className="w-1 h-3 bg-[#8B2E2E] rounded-full"></div>
                          </div>
                          <span className="text-[8px] font-semibold text-[#8B2E2E] uppercase tracking-widest">
                            Active
                          </span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-[#6B7280] truncate">
                      Zone: {bike.zone || "Unknown Zone"}
                    </p>
                    {isNearestBike && (
                      <p className="mt-1 text-[10px] font-semibold text-[#8B2E2E] uppercase tracking-wide">
                        {formatDistance(nearestBikeData.distance)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              );
            })
          ) : (
            <div className="text-center py-20 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
              <div className="text-5xl mb-6 opacity-20">🗺️</div>
              <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-widest px-8 leading-relaxed">
                No bikes detected.
                <br />
                Add or fetch bikes to view live map data.
              </p>
            </div>
          )}
        </div>

        {selectedActiveBike && (
          <div className="mt-6 space-y-3">
            <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#E5E7EB]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest">
                  Battery
                </span>
                <span className="text-[#047857] font-semibold text-xs">
                  84%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#047857] w-[84%]"></div>
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
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Pre-Permission Blur Overlay */}
          {!locationGranted && (
            <div className="absolute inset-0 z-[2000] bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-xl max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#8B2E2E]"></div>
                <div className="w-20 h-20 bg-[#FCEAEA] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  📍
                </div>
                <h3 className="text-2xl font-semibold text-[#2F2F2F] tracking-tight mb-2">
                  Enable Location Access
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                  Allow location access so we can show your position, nearest bike,
                  and route guidance.
                </p>
                <button
                  onClick={requestLocationAccess}
                  className="w-full py-3 bg-[#8B2E2E] hover:bg-[#6F2323] text-white rounded-md font-semibold text-sm tracking-wide transition-colors"
                >
                  Allow GPS Access
                </button>
                {locationError && (
                  <p className="text-[#B91C1C] text-xs font-medium mt-4 animate-in slide-in-from-bottom-2">
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

          {activeRideTrail.length >= 2 && (
            <>
              <Polyline
                positions={activeRideTrail}
                pathOptions={{ color: "#F2CACA", weight: 8, opacity: 0.45 }}
              />
              <Polyline
                positions={activeRideTrail}
                pathOptions={{ color: "#8B2E2E", weight: 4, opacity: 0.95 }}
              />
            </>
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
                ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]"
                : isActiveBike
                  ? "bg-[#FCEAEA] text-[#8B2E2E] border border-[#F2CACA]"
                  : "bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]";

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
                    <div className="font-semibold uppercase text-[10px] mb-1 text-[#8B2E2E]">
                      {bike.bikeName}
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${statusBadgeClass}`}
                    >
                      {statusLabel}
                    </div>
                    <div className="text-[9px] font-medium text-[#6B7280] uppercase mt-2">
                      {isActiveBike
                        ? isLive
                          ? "Live GPS"
                          : "Last Known Location"
                        : statusLabel}
                    </div>
                    <div className="mt-1 text-[9px] font-medium text-[#6B7280] uppercase tracking-wide">
                      Zone: {bike.zone || "Unknown Zone"}
                    </div>
                    {isNearestBike && (
                      <div className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-[#8B2E2E]">
                        Nearest Bike
                        {nearestDistanceLabel ? ` | ${nearestDistanceLabel}` : ""}
                      </div>
                    )}
                    {isSelectedMapBike && routeInfo && (
                      <div className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-[#8B2E2E]">
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

        {/* Mobile HUD */}
        <div className="md:hidden absolute top-3 left-3 right-3 z-[1000]">
          <div className="bg-white/95 p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="text-[9px] font-semibold text-[#8B2E2E] uppercase tracking-[0.18em] mb-1">
              MFU Campus
            </div>
            <div className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wide truncate">
              {currentZoneLabel}
            </div>
            <div className="text-[10px] font-mono text-[#374151] mt-1">
              {userLoc
                ? `${userLoc.lat.toFixed(4)}, ${userLoc.lng.toFixed(4)}`
                : `${selectedActiveBike?.lat?.toFixed(4) || "---"}, ${selectedActiveBike?.lng?.toFixed(4) || "---"}`}
            </div>
          </div>
        </div>

        {/* Mobile Bike Picker */}
        <div className="md:hidden absolute bottom-20 left-3 right-3 z-[1000]">
          <div className="bg-white/95 border border-[#E5E7EB] rounded-xl shadow-sm p-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {mapBikes.map((bike) => {
                const isSelected = selectedMapBike?.bikeId === bike.bikeId;
                return (
                  <button
                    key={`mobile-${bike.id}`}
                    onClick={() => {
                      setSelectedMapBikeId(bike.bikeId);
                      setSelectedBike(bike.activeRental || null);
                    }}
                    className={`min-w-[160px] text-left rounded-lg border p-2.5 ${
                      isSelected
                        ? "bg-[#FCEAEA] border-[#8B2E2E]/40"
                        : "bg-white border-[#E5E7EB]"
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#2F2F2F] truncate">
                      {bike.bikeName}
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1 truncate">
                      Zone: {bike.zone || "Unknown Zone"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map HUD Elements */}
        <div className="hidden md:flex absolute top-8 right-8 flex-col gap-4 z-[1000]">
          <div className="bg-white/95 p-4 rounded-xl border border-[#E5E7EB] shadow-md">
            <div className="text-[9px] font-semibold text-[#8B2E2E] uppercase tracking-[0.18em] mb-1">
              MFU Campus
            </div>
            <div className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wide">
              {currentZoneLabel}
            </div>
            <div className="text-xs font-mono text-[#374151] mt-2">
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
            <div className="bg-white/95 p-4 rounded-xl border border-[#F2CACA] shadow-md">
              <div className="text-[9px] font-semibold text-[#8B2E2E] uppercase tracking-[0.18em] mb-1">
                {routeInfo.label || "Shortest Route"}
              </div>
              <div className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wide truncate">
                {routeTarget.bikeName}
              </div>
              {routeInfo.error ? (
                <div className="text-[10px] font-semibold text-[#B91C1C] uppercase tracking-wide mt-2">
                  {routeInfo.error}
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-semibold text-[#8B2E2E] uppercase tracking-wide mt-2">
                    {formatDistance(routeInfo.distance)}
                  </div>
                  <div className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wide mt-1">
                    {formatTravelTime(routeInfo.duration)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block absolute bottom-10 left-10 z-[1000] pointer-events-none">
          <div className="bg-white/95 border border-[#F2CACA] p-2 rounded-xl flex items-center gap-3 shadow-md">
            <div className="w-2.5 h-2.5 bg-[#8B2E2E] rounded-full animate-ping"></div>
            <span className="text-[10px] font-semibold text-[#8B2E2E] uppercase tracking-widest pr-2">
              Live Tracking
            </span>
          </div>
        </div>
      </div>

      <style>{`
                .custom-popup .leaflet-popup-content-wrapper {
                  background: #ffffff;
                  color: #2f2f2f;
                  border-radius: 0.75rem;
                  border: 1px solid #e5e7eb;
                  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
                }
                .custom-popup .leaflet-popup-tip {
                  background: #ffffff;
                }
                .leaflet-container {
                  background: #f3f4f6 !important;
                }
            `}</style>
    </div>
  );
};

export default LiveTracking;
