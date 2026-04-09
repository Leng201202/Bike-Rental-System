export const FALLBACK_BIKE_IMAGE = "/fallback-bike.svg";

export const getBikeImageUrl = (bike) => {
  if (!bike || typeof bike !== "object") return FALLBACK_BIKE_IMAGE;

  const raw =
    bike.imageUrl ||
    bike.bikeImage ||
    bike.image ||
    bike.imagePath ||
    bike.image_path ||
    bike.url;

  if (!raw || typeof raw !== "string") return FALLBACK_BIKE_IMAGE;

  const normalized = raw.trim();
  if (!normalized) return FALLBACK_BIKE_IMAGE;

  if (/^(https?:|data:|blob:)/i.test(normalized)) return normalized;
  if (normalized.startsWith("//")) return `https:${normalized}`;
  if (normalized.startsWith("/")) return normalized;

  return `/${normalized}`;
};

export const normalizeBike = (bike = {}) => ({
  ...bike,
  id: bike.id,
  name: bike.name || bike.bikeName || "Unnamed Bike",
  type: bike.type || bike.bikeType || "CITY",
  status: String(bike.status || "AVAILABLE").toUpperCase(),
  pricePerHour: Number(bike.pricePerHour ?? bike.price_hour ?? 0),
  pricePerKm: Number(bike.pricePerKm ?? bike.price_km ?? 0),
  imageUrl: getBikeImageUrl(bike),
  location: {
    ...(bike.location || {}),
    lat: Number(bike.location?.lat ?? bike.lat ?? 0),
    lng: Number(bike.location?.lng ?? bike.lng ?? 0),
  },
});
