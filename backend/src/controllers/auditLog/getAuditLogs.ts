import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getAuditLogs = catchAsync(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Number(req.query.offset) || 0;

  const { data, error, count } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return res.status(400).json({ error });

  const actorIds = [...new Set((data ?? []).map((log: any) => log.actor_id))];

  const { data: superAdmins, error: adminsError } = await supabase
    .from("super_admins")
    .select("id, name")
    .in("id", actorIds.length > 0 ? actorIds : [0]);

  if (adminsError) return res.status(400).json({ error: adminsError });

  const actorMap = new Map(superAdmins.map((a: any) => [a.id, a.name]));

  const logs = (data ?? []).map((log: any) => ({
    ...log,
    actor_name: actorMap.get(log.actor_id) ?? "Unknown",
  }));

  res.json({ logs, total: count ?? 0, limit, offset });
});
