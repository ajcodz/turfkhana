/**
 * Vercel serverless entrypoint.
 *
 * An Express app is itself a (req, res) handler, so Vercel can invoke it
 * directly. vercel.json rewrites /api/* here, and Vercel passes the original
 * URL through, so the app still sees /api/v1/... and its routers match as they
 * do locally.
 *
 * Imports the TypeScript source rather than backend/dist so this does not
 * depend on the backend build having run first.
 *
 * No dotenv here: on Vercel the environment comes from project settings, and
 * `backend/src/db/config.ts` already loads .env for local runs.
 */
import app from "../backend/src/app";

export default app;
