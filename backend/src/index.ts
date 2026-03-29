import app from "./app";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes";
import clientRoutes from "./routes/clientRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import turfRoutes from "./routes/turfRoutes";
import settingRoutes from "./routes/settingRoutes";

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string) || 3000;

const V1: string = "/api/v1";

app.use(V1 + "/bookings", bookingRoutes);
app.use(V1 + "/turfs", turfRoutes);
app.use(V1 + "/clients", clientRoutes);
app.use(V1 + "/owners", ownerRoutes);
app.use(V1 + "/settings", settingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
