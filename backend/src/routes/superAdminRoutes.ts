import { Router } from "express";
import { loginSuperAdmin } from "../controllers/superAdmin/loginSuperAdmin";
import { logoutSuperAdmin } from "../controllers/superAdmin/logoutSuperAdmin";
import { getCurrentSuperAdmin } from "../controllers/superAdmin/getCurrentSuperAdmin";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.post("/login", loginSuperAdmin);
router.post("/logout", logoutSuperAdmin);
router.get(
  "/me",
  requireAuth,
  requireRole("super_admin"),
  getCurrentSuperAdmin,
);

export default router;
