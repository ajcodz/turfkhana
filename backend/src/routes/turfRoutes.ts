import { Router } from "express";
import { getAllTurfs } from "../controllers/turf/getAllTurfs";
import { createTurf } from "../controllers/turf/createTurf";

const router = Router();

router.post("/", createTurf);
router.get("/", getAllTurfs);

export default router;