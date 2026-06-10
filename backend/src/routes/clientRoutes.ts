import { Router } from "express";
import { getClients } from "../controllers/client/getClients";
import { createClient } from "../controllers/client/createClient";
import { updateClient } from "../controllers/client/updateClient";
import { deleteClient } from "../controllers/client/deleteClient";

const router = Router();

router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
