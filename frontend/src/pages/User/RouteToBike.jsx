import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";

const ROUTE_DEBOUNCE_MS = 1200;
const OSRM_PROFILE = "cycling";

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

const RouteToBike = ({ userLoc, destination, onRouteInfoChange }) => {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const hasValidEndpoints =
      isValidCoordinate(userLoc?.lat, userLoc?.lng) &&
      isValidCoordinate(destination?.lat, destination?.lng);

    if (!hasValidEndpoints) {
      setRouteCoords([]);
      onRouteInfoChange?.(null);
      return;
    }

    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      const fetchRoute = async () => {
        try {
          const url =
            `https://router.project-osrm.org/route/v1/${OSRM_PROFILE}/` +
            `${userLoc.lng},${userLoc.lat};${destination.lng},${destination.lat}` +
            `?alternatives=false&overview=full&geometries=geojson&steps=true`;

          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) {
            throw new Error("Routing request failed");
          }

          const data = await response.json();
          const route = data?.routes?.[0];

          if (!route?.geometry?.coordinates?.length) {
            setRouteCoords([]);
            onRouteInfoChange?.({
              error: "No route found on nearby roads.",
              distance: null,
              duration: null,
            });
            return;
          }

          const latLngs = route.geometry.coordinates
            .map(([lng, lat]) => [lat, lng])
            .filter(([lat, lng]) => isValidCoordinate(lat, lng));

          if (latLngs.length < 2) {
            setRouteCoords([]);
            onRouteInfoChange?.({
              error: "No route found on nearby roads.",
              distance: null,
              duration: null,
            });
            return;
          }

          setRouteCoords(latLngs);
          onRouteInfoChange?.({
            distance: route.distance,
            duration: route.duration,
            error: null,
            label: "Shortest Route",
          });
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Failed to fetch route:", error);
            setRouteCoords([]);
            onRouteInfoChange?.({
              error: "Routing service is unavailable.",
              distance: null,
              duration: null,
            });
          }
        }
      };

      fetchRoute();
    }, ROUTE_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [destination, onRouteInfoChange, userLoc]);

  if (routeCoords.length < 2) return null;

  return (
    <>
      <Polyline
        positions={routeCoords}
        pathOptions={{ color: "#38bdf8", weight: 10, opacity: 0.25 }}
      />
      <Polyline
        positions={routeCoords}
        pathOptions={{ color: "#0ea5e9", weight: 5, opacity: 0.95 }}
      />
    </>
  );
};

export default RouteToBike;
