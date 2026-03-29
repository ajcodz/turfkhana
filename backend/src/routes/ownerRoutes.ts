import { Router } from "express";
import { getOwners } from "../controllers/owner/getOwners";
import { createOwner } from "../controllers/owner/createOwner";

const router = Router();

router.post("/", createOwner);
router.get("/", getOwners);

export default router;