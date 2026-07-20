import express from "express";
import cors from "cors";
import superAdminRoutes from "./routes/superAdminRoutes";
import cookieParser from "cookie-parser";
import turfRoutes from "./routes/turfRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import clientRoutes from "./routes/clientRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import paymentRoutes from "./routes/paymentRoutes";
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
app.use(`/api/${V1}/turfs`, turfRoutes);
app.use(`/api/${V1}/bookings`, bookingRoutes);
app.use(`/api/${V1}/clients`, clientRoutes);
app.use(`/api/${V1}/owners`, ownerRoutes);
app.use(`/api/${V1}/payments`, paymentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Middleware
app.use(errorHandler);

export default app;
