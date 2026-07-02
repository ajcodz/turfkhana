import { Router } from "express";
import { getSettings } from "../controllers/setting/getSettings";
import { createSetting } from "../controllers/setting/createSetting";
import { deleteSetting } from "../controllers/setting/deleteSetting";
import { updateSetting } from "../controllers/setting/updateSetting";

const router = Router();

router.post("/", createSetting);
router.get("/", getSettings);
router.delete("/:id", deleteSetting);
router.put("/:id", updateSetting);

export default router;
