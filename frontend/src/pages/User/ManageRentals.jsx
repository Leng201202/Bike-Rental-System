import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBikeStore from "../../store/useBikeStore";
import Button from "../../components/UI/Button";
import { showToast } from '../../components/UI/toast';
import { requestPreciseLocation, verifyBikeCodeWithPrompt } from "../../utils/rideAccess";

const getRideTrackStorageKey = (rentalId) => `ride-gps-track-${rentalId}`;

const haversineMeters = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
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

const getTrackedDistanceKm = (rentalId) => {
  if (!rentalId) return null;
  try {
    const raw = localStorage.getItem(getRideTrackStorageKey(rentalId));
    if (!raw) return null;

    const points = JSON.parse(raw);
    if (!Array.isArray(points) || points.length < 2) return null;

    let meters = 0;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const current = points[i];
      const lat1 = Number(prev?.lat);
      const lng1 = Number(prev?.lng);
      const lat2 = Number(current?.lat);
      const lng2 = Number(current?.lng);

      if (
        Number.isFinite(lat1) &&
        Number.isFinite(lng1) &&
        Number.isFinite(lat2) &&
        Number.isFinite(lng2)
      ) {
        meters += haversineMeters(lat1, lng1, lat2, lng2);
      }
    }

    return meters > 0 ? (meters / 1000).toFixed(2) : null;
  } catch {
    return null;
  }
};

const ManageRentals = () => {
  const navigate = useNavigate();
  const { activeRentals, activateReservation, cancelReservation, fetchBikes } =
    useBikeStore();
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  // Live ticking clock for tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReturnClick = (rental) => {
    navigate("/payment", { state: { rental } });
  };

  const handleStartRide = async (rental) => {
    try {
      await requestPreciseLocation();
    } catch (error) {
      showToast.error(error.message || "Please enable GPS before starting your ride.");
      return;
    }

    const verification = verifyBikeCodeWithPrompt({
      bikeId: rental.bikeId,
      bikeName: rental.bikeName,
    });

    if (!verification.ok) {
      if (verification.reason === "MISMATCH") {
        showToast.error(`QR code does not match this bike. Expected ${verification.expected}.`);
      }
      return;
    }

    const result = await activateReservation(rental.id);
    if (result?.success) {
      showToast.success(`${rental.bikeName} is now active. Have a safe ride.`);
      navigate("/map");
      return;
    }

    if (result?.reason === "EXPIRED") {
      showToast.error(
        `Reservation for ${rental.bikeName} expired and was auto-cancelled.`,
      );
      return;
    }

    showToast.error(`Unable to start reservation for ${rental.bikeName}.`);
  };

  const handleCancelReservation = async (rental) => {
    const result = await cancelReservation(rental.id);
    if (result?.success) {
      showToast.success(`Reservation for ${rental.bikeName} was cancelled.`);
    } else {
      showToast.error(`Unable to cancel reservation for ${rental.bikeName}.`);
    }
  };

  // Helper functions for live calculations
  const getElapsedSeconds = (startTime) => {
    return Math.floor((currentTime - new Date(startTime).getTime()) / 1000);
  };

  const formatDuration = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatGpsDistance = (rentalId) => {
    const tracked = getTrackedDistanceKm(rentalId);
    return tracked || "0.00";
  };

  const getRemainingSeconds = (reservationEndsAt) => {
    return Math.max(
      0,
      Math.floor((new Date(reservationEndsAt).getTime() - currentTime) / 1000),
    );
  };

  const activeRides = activeRentals.filter(
    (rental) => rental.status === "ACTIVE",
  );
  const reservedRides = activeRentals.filter(
    (rental) => rental.status === "RESERVED",
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
            Current Rentals & Reservations
          </h2>
        </div>
        {activeRentals.length > 0 ? (
          <div className="space-y-6">
            {activeRides.map((rental) => {
              const elapsedSeconds = getElapsedSeconds(rental.startTime);
              const activeDuration = formatDuration(elapsedSeconds);
              const activeDistance = formatGpsDistance(rental.id);

              return (
                <div
                  key={rental.id}
                  className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="text-8xl font-black italic select-none">
                      LIVE
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black">
                          {rental.bikeName}
                        </h3>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          {rental.method}
                        </div>
                      </div>

                      {/* Live Telemetry Data */}
                      <div className="grid grid-cols-2 gap-4 mt-6 max-w-sm">
                        {rental.method === "HOURLY" ? (
                          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                              Time Elapsed
                            </span>
                            <span className="text-2xl font-mono text-white font-bold tracking-tighter">
                              {activeDuration}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                              Distance
                            </span>
                            <span className="text-2xl font-mono text-white font-bold tracking-tighter">
                              {activeDistance}{" "}
                              <span className="text-sm">km</span>
                            </span>
                          </div>
                        )}

                        <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                            Current Fee
                          </span>
                          <span className="text-2xl font-mono text-white tracking-tighter shadow-blue-500/20 drop-shadow-lg">
                            <span className="text-blue-500 mr-1 text-sm">
                              ฿
                            </span>
                            {rental.currentCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right mt-4 md:mt-0">
                      <Button
                        onClick={() => handleReturnClick(rental)}
                        className="px-8 py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95 shadow-xl shadow-red-600/20"
                      >
                        End Ride & Pay
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {reservedRides.map((rental) => {
              const remainingSeconds = getRemainingSeconds(
                rental.reservationEndsAt,
              );
              const remainingTime = formatDuration(remainingSeconds);

              return (
                <div
                  key={rental.id}
                  className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="text-7xl font-black italic select-none">
                      HOLD
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black">
                          {rental.bikeName}
                        </h3>
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-black text-amber-300 uppercase tracking-widest">
                          RESERVED
                        </div>
                      </div>

                      <p className="text-xs text-amber-100/80 font-bold mb-5">
                        This bike is reserved for you for 30 minutes. Start your
                        ride before the timer reaches 00:00.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-2 max-w-sm">
                        <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                            Time Left
                          </span>
                          <span className="text-2xl font-mono text-white font-bold tracking-tighter">
                            {remainingTime}
                          </span>
                        </div>

                        <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                            Plan
                          </span>
                          <span className="text-lg font-mono text-white tracking-tighter">
                            {rental.method}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right mt-4 md:mt-0 flex flex-col gap-3 w-full md:w-auto">
                      <Button
                        onClick={() => handleStartRide(rental)}
                        disabled={remainingSeconds <= 0}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-500 transition-all active:scale-95 shadow-xl shadow-green-600/20"
                      >
                        {remainingSeconds > 0
                          ? "Start Ride"
                          : "Reservation Expiring"}
                      </Button>
                      <Button
                        onClick={() => handleCancelReservation(rental)}
                        variant="outline"
                        className="px-8 py-3 border-amber-400/30 text-amber-200"
                      >
                        Cancel Reservation
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/10 border border-gray-700/30 p-12 rounded-[2rem] text-center italic text-gray-500">
            No active rentals or reservations. Browse the fleet to start a
            journey.
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageRentals;
