import { Router } from "express";
import { getSettings } from "../controllers/setting/getSettings";
import { createSetting } from "../controllers/setting/createSetting";
import { deleteSetting } from "../controllers/setting/deleteSetting";

const router = Router();

router.post("/", createSetting);
router.get("/", getSettings);
router.delete("/:id", deleteSetting);

export default router;
