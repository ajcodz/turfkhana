import { Request } from "express";
import { supabase } from "../db/config";
import { CreateAuditLogDTO } from "../models/auditLog.model";

/**
 * Records a super-admin action for accountability. Failures here are
 * logged but never thrown — a broken audit write should never block
 * the actual action (e.g. deactivating an owner) from completing.
 */
export const logAuditEvent = async (
  req: Request,
  entry: Omit<CreateAuditLogDTO, "actor_id" | "actor_role">,
) => {
  if (!req.user) return;

  const payload: CreateAuditLogDTO = {
    actor_id: req.user.id,
    actor_role: req.user.role,
    ...entry,
  };

  const { error } = await supabase.from("audit_logs").insert([payload]);

  if (error) {
    console.error("Failed to write audit log:", error, payload);
  }
};
