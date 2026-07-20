import { Router } from "express";
import { getOwners } from "../controllers/owner/getOwners";
import { createOwner } from "../controllers/owner/createOwner";
import { updateOwner } from "../controllers/owner/updateOwner";
import { deleteOwner } from "../controllers/owner/deleteOwner";
import { loginOwner } from "../controllers/owner/loginOwner";
import { logoutOwner } from "../controllers/owner/logoutOwner";
import { getCurrentOwner } from "../controllers/owner/getCurrentOwner";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.get("/me", requireAuth, getCurrentOwner);

router.post("/", requireAuth, requireRole("super_admin"), createOwner);
router.get("/", requireAuth, requireRole("super_admin"), getOwners);
router.put("/:id", requireAuth, requireRole("super_admin"), updateOwner);
router.delete("/:id", requireAuth, requireRole("super_admin"), deleteOwner);

export default router;
