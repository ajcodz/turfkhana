import app from "./app";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes";

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string) || 3000;

const V1: string = "/api/v1";

app.use(V1 + "/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
