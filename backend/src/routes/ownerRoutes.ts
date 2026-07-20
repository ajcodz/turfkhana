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

router.post("/", requireAuth, requireRole("owner"), createOwner);
router.get("/", requireAuth, requireRole("owner"), getOwners);
router.put("/:id", requireAuth, requireRole("owner"), updateOwner);
router.delete("/:id", requireAuth, requireRole("owner"), deleteOwner);

export default router;