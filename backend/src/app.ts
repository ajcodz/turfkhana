import express from "express";
import path from "path";
import cors from "cors";
import superAdminRoutes from "./routes/superAdminRoutes";
import cookieParser from "cookie-parser";
import turfRoutes from "./routes/turfRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import auditLogRoutes from "./routes/auditLogRoutes";
import clientRoutes from "./routes/clientRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import settingRoutes from "./routes/settingRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
const V1 = "v1";

app.use(`/api/${V1}/super-admins`, superAdminRoutes);
app.use(`/api/${V1}/audit-logs`, auditLogRoutes);
app.use(`/api/${V1}/turfs`, turfRoutes);
app.use(`/api/${V1}/bookings`, bookingRoutes);
app.use(`/api/${V1}/clients`, clientRoutes);
app.use(`/api/${V1}/owners`, ownerRoutes);
app.use(`/api/${V1}/payments`, paymentRoutes);
app.use(`/api/${V1}/settings`, settingRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Static frontend
// Resolves to <repo-root>/dist from both ./src (ts-node) and ./dist (compiled).
const FRONTEND_DIST =
  process.env.FRONTEND_DIST_PATH || path.resolve(__dirname, "../../dist");

app.use(express.static(FRONTEND_DIST));

// SPA fallback: hand any non-API GET back to index.html so client-side
// routing works on a hard refresh / direct link.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

// Middleware
app.use(errorHandler);

export default app;
