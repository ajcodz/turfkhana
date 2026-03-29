import { Router } from "express";
import { getClients } from "../controllers/client/getClients";
import { createClient } from "../controllers/client/createClient";

const router = Router();

router.post("/", createClient);
router.get("/", getClients);

export default router;