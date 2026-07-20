import { Router } from "express";
import { getAllTurfs } from "../controllers/turf/getAllTurfs";
import { createTurf } from "../controllers/turf/createTurf";
import { getTurfById } from "../controllers/turf/getTurfById";
import { updateTurf } from "../controllers/turf/updateTurf";
import { deleteTurf } from "../controllers/turf/deleteTurf";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", getAllTurfs);
router.get("/:id", getTurfById);

router.post("/", requireAuth, requireRole("owner"), createTurf);
router.put("/:id", requireAuth, requireRole("owner"), updateTurf);
router.delete("/:id", requireAuth, requireRole("owner"), deleteTurf);

export default router;