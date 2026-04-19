export const getExpectedBikeQrCode = (bikeId) => `BIKE-${bikeId}`;

const normalizeCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export const requestPreciseLocation = () =>
  new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        reject(
          new Error(
            "GPS access is required before starting a ride so we can update bike location at ride end.",
          ),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });

export const verifyBikeCodeWithPrompt = ({ bikeId, bikeName }) => {
  const expected = normalizeCode(getExpectedBikeQrCode(bikeId));
  const entered = window.prompt(
    `Scan the QR code on ${bikeName || `Bike #${bikeId}`} and enter the code.\nExpected format: ${expected}`,
    "",
  );

  if (entered === null) {
    return { ok: false, reason: "CANCELLED" };
  }

  if (normalizeCode(entered) !== expected) {
    return { ok: false, reason: "MISMATCH", expected };
  }

  return { ok: true };
};
