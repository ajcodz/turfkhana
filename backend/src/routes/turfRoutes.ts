import { Router } from "express";
import { getAllTurfs } from "../controllers/turf/getAllTurfs";
import { createTurf } from "../controllers/turf/createTurf";
import { getTurfById } from "../controllers/turf/getTurfById";
import { updateTurf } from "../controllers/turf/updateTurf";

const router = Router();

router.post("/", createTurf);
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);
router.put("/:id", updateTurf);

export default router;
