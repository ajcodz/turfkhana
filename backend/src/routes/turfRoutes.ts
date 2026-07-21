import { Router } from "express";
import { getAllTurfs } from "../controllers/turf/getAllTurfs";
import { getAllTurfsForSuperAdmin } from "../controllers/turf/getAllTurfsForSuperAdmin";
import { setTurfStatus } from "../controllers/turf/setTurfStatus";
import { createTurf } from "../controllers/turf/createTurf";
import { getTurfById } from "../controllers/turf/getTurfById";
import { getMyTurfs } from "../controllers/turf/getMyTurfs";
import { updateTurf } from "../controllers/turf/updateTurf";
import { deleteTurf } from "../controllers/turf/deleteTurf";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get(
  "/admin/all",
  requireAuth,
  requireRole("super_admin"),
  getAllTurfsForSuperAdmin,
);

router.put(
  "/:id/status",
  requireAuth,
  requireRole("super_admin"),
  setTurfStatus,
);
router.get("/mine", requireAuth, requireRole("owner"), getMyTurfs);
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);

router.post("/", requireAuth, requireRole("owner"), createTurf);
router.put("/:id", requireAuth, requireRole("owner"), updateTurf);
router.delete(
  "/:id",
  requireAuth,
  requireRole("owner", "super_admin"),
  deleteTurf,
);

export default router;
