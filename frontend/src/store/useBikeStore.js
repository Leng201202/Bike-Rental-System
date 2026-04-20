import { create } from "zustand";
import api, { getApiErrorMessage, unwrapApiResponse } from "../api/api";
import { getBikeImageUrl, normalizeBike } from "../utils/bikeData";
import useAuthStore from "./useAuthStore";
import useNotificationStore from "./useNotificationStore";

const toRentalDuration = (seconds = 0) => {
  const total = Number(seconds) || 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}h ${m}m`;
};

const mapRentalToUi = (rental, bikeMap) => {
  const bike = bikeMap.get(rental.bikeId);
  return {
    id: rental.id,
    bikeId: rental.bikeId,
    bikeName: bike?.name || `Bike #${rental.bikeId}`,
    bikeImage: getBikeImageUrl(bike),
    bikeType: bike?.type || "CITY",
    startTime: rental.startedAt,
    currentCost: Number(rental.totalCost ?? 0),
    method: rental.method,
    status: rental.status,
    reservedAt: rental.reservedAt,
    reservationEndsAt: rental.reservationEndsAt,
    lat: bike?.location?.lat || 20.046,
    lng: bike?.location?.lng || 99.8943,
    zone: bike?.location?.zone || "Unknown Zone",
    distanceKm: Number(rental.distanceKm ?? 0),
    durationSeconds: Number(rental.durationSeconds ?? 0),
    route: null,
  };
};

const splitRentals = (rentals, bikes) => {
  const bikeMap = new Map((bikes || []).map((bike) => [bike.id, bike]));
  const normalized = (rentals || []).map((rental) => mapRentalToUi(rental, bikeMap));

  const activeRentals = normalized.filter(
    (rental) => rental.status === "ACTIVE" || rental.status === "RESERVED",
  );

  const rentalHistory = normalized
    .filter((rental) => rental.status === "COMPLETED")
    .map((rental) => ({
      id: rental.id,
      bikeId: rental.bikeId,
      bikeName: rental.bikeName,
      date: rental.startTime ? new Date(rental.startTime).toISOString().split("T")[0] : "-",
      duration: toRentalDuration(rental.durationSeconds),
      totalCost: Number(rental.currentCost || 0),
    }))
    .sort((a, b) => (a.id < b.id ? 1 : -1));

  return { activeRentals, rentalHistory };
};

const getCurrentUserId = () => useAuthStore.getState().user?.id;

const useBikeStore = create((set, get) => ({
  bikes: [],
  loading: false,
  error: null,
  activeRentals: [],
  rentalHistory: [],

  syncUserRentals: async (userId) => {
    if (!userId) {
      set({ activeRentals: [], rentalHistory: [] });
      return;
    }

    const rentals = unwrapApiResponse(await api.get(`/rentals/users/${userId}`));
    const { activeRentals, rentalHistory } = splitRentals(rentals, get().bikes);
    set({ activeRentals, rentalHistory });
  },

  fetchBikes: async () => {
    set({ loading: true, error: null });
    try {
      const bikes = unwrapApiResponse(await api.get("/bikes"));
      const normalizedBikes = (bikes || []).map(normalizeBike);
      set({ bikes: normalizedBikes, loading: false });

      const userId = getCurrentUserId();
      if (userId) {
        await get().syncUserRentals(userId);
      }
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Failed to fetch bikes"),
        loading: false,
      });
    }
  },

  rentBike: async (bikeId, method, rentalType = "IMMEDIATE") => {
    set({ loading: true, error: null });
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Please login as a rider first.");
      }

      await get().syncUserRentals(userId);
      const hasOpenRental = get().activeRentals.some(
        (rental) => rental.status === "ACTIVE" || rental.status === "RESERVED",
      );
      if (hasOpenRental) {
        const message = "You already have an active or reserved rental. Please end or cancel it before starting a new ride.";
        set({ loading: false, error: message });
        return { success: false, error: message, reason: "OPEN_RENTAL" };
      }

      const rental = unwrapApiResponse(
        await api.post("/rentals/start", {
          userId,
          bikeId,
          method,
          rentalType,
        }),
      );

      await get().fetchBikes();
      await get().syncUserRentals(userId);
      set({ loading: false });

      useNotificationStore.getState().notify({
        title: rentalType === "RESERVE_30_MIN" ? "Bike Reserved" : "Ride Started",
        message:
          rentalType === "RESERVE_30_MIN"
            ? `Your bike has been reserved for 30 minutes.`
            : `Your rental is active. Open Live Tracking to navigate.`,
        level: "success",
      });

      const createdRental = get().activeRentals.find((item) => item.id === rental.id);
      return { success: true, rental: createdRental || rental };
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to rent bike");
      set({
        error: message,
        loading: false,
      });
      return { success: false, error: message };
    }
  },

  activateReservation: async (rentalId, bikeCode) => {
    const reservation = get().activeRentals.find((rental) => rental.id === rentalId);
    if (!reservation || reservation.status !== "RESERVED") {
      return { success: false, reason: "NOT_FOUND" };
    }

    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Please login as a rider first.");
      }

      unwrapApiResponse(
        await api.post(`/rentals/${rentalId}/activate`, {
          bikeCode,
        }),
      );

      await get().fetchBikes();
      await get().syncUserRentals(userId);
      return { success: true };
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to start reservation");
      const normalized = String(message || "").toLowerCase();
      return {
        success: false,
        reason: normalized.includes("expired") ? "EXPIRED" : "FAILED",
        error: message,
      };
    }
  },

  cancelReservation: async (rentalId) => {
    const reservation = get().activeRentals.find((rental) => rental.id === rentalId);
    if (!reservation || reservation.status !== "RESERVED") {
      return { success: false, reason: "NOT_FOUND" };
    }

    set((state) => ({
      activeRentals: state.activeRentals.filter((rental) => rental.id !== rentalId),
      bikes: state.bikes.map((bike) =>
        bike.id === reservation.bikeId ? { ...bike, status: "AVAILABLE" } : bike,
      ),
    }));

    return { success: true };
  },

  returnBike: async (rentalId, paymentDetails, rideTelemetry = {}) => {
    set({ loading: true, error: null });
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Please login as a rider first.");
      }

      const rental = get().activeRentals.find((item) => item.id === rentalId);
      if (!rental || rental.status !== "ACTIVE") {
        set({ loading: false });
        return { success: false };
      }

      const fallbackDistance = Number(paymentDetails?.distanceKm || rental.distanceKm || 0);
      const routePoints = Array.isArray(rideTelemetry?.routePoints)
        ? rideTelemetry.routePoints
            .map((point) => ({
              lat: Number(point?.lat),
              lng: Number(point?.lng),
            }))
            .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
        : [];

      const endLat = Number(rideTelemetry?.finalLat);
      const endLng = Number(rideTelemetry?.finalLng);

      unwrapApiResponse(
        await api.post(`/rentals/${rentalId}/end`, {
          distanceKm: Number.isFinite(fallbackDistance) ? fallbackDistance : 0,
          endLat: Number.isFinite(endLat) ? endLat : null,
          endLng: Number.isFinite(endLng) ? endLng : null,
          routePoints,
        }),
      );
      const payment = unwrapApiResponse(
        await api.post(`/payments/rentals/${rentalId}/pay`, {
          userId,
          method: "PROMPTPAY",
        }),
      );

      await get().fetchBikes();
      await get().syncUserRentals(userId);
      set({ loading: false });

      useNotificationStore.getState().notify({
        title: "Ride Completed",
        message: `Bike returned and payment completed${payment?.transactionCode ? ` (${payment.transactionCode})` : ''}.`,
        level: "success",
      });
      return { success: true, payment };
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to return bike");
      set({
        error: message,
        loading: false,
      });
      return { success: false, error: message };
    }
  },

  addBike: async (bikeData) => {
    set({ loading: true, error: null });
    try {
      unwrapApiResponse(
        await api.post("/bikes", {
          name: bikeData.name,
          type: bikeData.type,
          status: bikeData.status,
          pricePerHour: Number(bikeData.pricePerHour || 0),
          pricePerKm: Number(bikeData.pricePerKm || 0),
          currentZone: bikeData.currentZone || "Campus",
          currentLat: bikeData.currentLat == null || bikeData.currentLat === "" ? null : Number(bikeData.currentLat),
          currentLng: bikeData.currentLng == null || bikeData.currentLng === "" ? null : Number(bikeData.currentLng),
          imageUrl: bikeData.imageUrl || null,
          description: bikeData.description || null,
        }),
      );
      await get().fetchBikes();
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Failed to add bike"),
        loading: false,
      });
      return false;
    }
  },

  updateBike: async (id, bikeData) => {
    set({ loading: true, error: null });
    try {
      unwrapApiResponse(
        await api.put(`/bikes/${id}`, {
          name: bikeData.name,
          type: bikeData.type,
          status: bikeData.status,
          pricePerHour: Number(bikeData.pricePerHour || 0),
          pricePerKm: Number(bikeData.pricePerKm || 0),
          currentZone: bikeData.currentZone || "Campus",
          currentLat: bikeData.currentLat == null || bikeData.currentLat === "" ? null : Number(bikeData.currentLat),
          currentLng: bikeData.currentLng == null || bikeData.currentLng === "" ? null : Number(bikeData.currentLng),
          imageUrl: bikeData.imageUrl || null,
          description: bikeData.description || null,
        }),
      );
      await get().fetchBikes();
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Failed to update bike"),
        loading: false,
      });
      return false;
    }
  },

  deleteBike: async (id) => {
    set({ loading: true, error: null });
    try {
      unwrapApiResponse(await api.delete(`/bikes/${id}`));
      await get().fetchBikes();
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Failed to delete bike"),
        loading: false,
      });
      return false;
    }
  },
}));

export default useBikeStore;
