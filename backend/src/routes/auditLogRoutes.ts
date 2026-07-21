import { Router } from "express";
import { getAuditLogs } from "../controllers/auditLog/getAuditLogs";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, requireRole("super_admin"), getAuditLogs);

export default router;
