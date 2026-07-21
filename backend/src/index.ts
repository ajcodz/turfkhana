import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
