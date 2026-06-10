import { Router } from "express";
import { getAllTurfs } from "../controllers/turf/getAllTurfs";
import { createTurf } from "../controllers/turf/createTurf";
import { getTurfById } from "../controllers/turf/getTurfById";
import { updateTurf } from "../controllers/turf/updateTurf";
import { deleteTurf } from "../controllers/turf/deleteTurf";

const router = Router();

router.post("/", createTurf);
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);
router.put("/:id", updateTurf);
router.delete("/:id", deleteTurf);

export default router;
