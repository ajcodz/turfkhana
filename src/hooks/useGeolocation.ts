import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  status: "idle" | "loading" | "success" | "denied" | "unsupported" | "error";
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    status: "idle",
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState((prev) => ({ ...prev, status: "unsupported" }));
      return;
    }

    setState((prev) => ({ ...prev, status: "loading" }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: "success",
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          status: error.code === error.PERMISSION_DENIED ? "denied" : "error",
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // reuse a cached position up to 5 min old
      },
    );
  }, []);

  return state;
};
