import { Router } from "express";
import { getAllTurfs } from "../controllers/turf/getAllTurfs";

const router = Router();

router.get("/", getAllTurfs);

export default router;