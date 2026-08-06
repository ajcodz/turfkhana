import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Turf } from "../../models/turf.model";
import { logAuditEvent } from "../../utils/auditLog";

export const setTurfStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active !== "boolean") {
    return res.status(400).json({ error: "is_active must be a boolean" });
  }

  const { data, error } = await supabase
    .from("turfs")
    .update({ is_active })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Turf not found" });
  }

  const updated = data[0] as Turf;

  await logAuditEvent(req, {
    action: is_active ? "enable_turf" : "disable_turf",
    target_type: "turf",
    target_id: updated.id,
    details: { name: updated.name, owner_id: updated.owner_id },
  });

  res.status(200).json({ turf: updated });
});
