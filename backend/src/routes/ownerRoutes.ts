import { Router } from "express";
import { getOwners } from "../controllers/owner/getOwners";
import { createOwner } from "../controllers/owner/createOwner";
import { updateOwner } from "../controllers/owner/updateOwner";
import { deleteOwner } from "../controllers/owner/deleteOwner";

const router = Router();

router.post("/", createOwner);
router.get("/", getOwners);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

export default router;
