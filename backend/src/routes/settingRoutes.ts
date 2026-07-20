import { Router } from "express";
import { getSettings } from "../controllers/setting/getSettings";
import { createSetting } from "../controllers/setting/createSetting";
import { deleteSetting } from "../controllers/setting/deleteSetting";
import { updateSetting } from "../controllers/setting/updateSetting";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", getSettings);

router.post("/", requireAuth, requireRole("owner"), createSetting);
router.delete("/:id", requireAuth, requireRole("owner"), deleteSetting);
router.put("/:id", requireAuth, requireRole("owner"), updateSetting);

export default router;
