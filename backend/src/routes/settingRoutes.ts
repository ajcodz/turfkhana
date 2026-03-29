import { Router } from "express";
import { getSettings } from "../controllers/setting/getSettings";
import { createSetting } from "../controllers/setting/createSetting";

const router = Router();

router.post("/", createSetting);
router.get("/", getSettings);

export default router;