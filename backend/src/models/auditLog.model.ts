export interface AuditLog {
  id: number;
  actor_id: number;
  actor_role: string;
  action: string;
  target_type: string;
  target_id: number | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export type CreateAuditLogDTO = Omit<AuditLog, "id" | "created_at">;
