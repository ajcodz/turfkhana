/**
 * Base URL for the backend API.
 *
 * In production the Express backend serves this build statically, so the API
 * lives on the same origin and a relative path is all that's needed. In `vite
 * dev` the same relative path is proxied to the backend (see vite.config.ts).
 *
 * Set VITE_SERVER_URL to point at a backend on a different origin.
 */
export const APP_BASE_URL = import.meta.env.VITE_SERVER_URL || "/api/v1";
