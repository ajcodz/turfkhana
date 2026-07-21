import { Router } from "express";
import { getClients } from "../controllers/client/getClients";
import { getMyClients } from "../controllers/client/getMyClients";
import { createClient } from "../controllers/client/createClient";
import { updateClient } from "../controllers/client/updateClient";
import { deleteClient } from "../controllers/client/deleteClient";
import { loginClient } from "../controllers/client/loginClient";
import { signupClient } from "../controllers/client/signupClient";
import { getClientByEmail } from "../controllers/client/getClientByEmail";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.post("/login", loginClient);
router.post("/signup", signupClient);
router.get("/email/:email", getClientByEmail);
router.get("/mine", requireAuth, requireRole("owner"), getMyClients);
router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
