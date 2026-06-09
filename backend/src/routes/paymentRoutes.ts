import { Router } from "express";
import { initiateTransaction } from "../controllers/payment/initiateTransaction";

const router = Router();

router.post("/", initiateTransaction);

export default router;
