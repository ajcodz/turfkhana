import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { logAuditEvent } from "../../utils/auditLog";

export const deleteOwner = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { data: existing } = await supabase
    .from("owners")
    .select("name, email")
    .eq("id", id)
    .single();

  const { count, error: countError } = await supabase
    .from("turfs")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", id);

  if (countError) return res.status(400).json({ error: countError });

  if (count && count > 0) {
    return res.status(409).json({
      error: `Cannot delete this owner — they still have ${count} turf(s). Deactivate the owner instead, or remove/reassign their turfs first.`,
    });
  }

  const { error } = await supabase.from("owners").delete().eq("id", id);

  if (error) return res.status(400).json({ error });

  await logAuditEvent(req, {
    action: "delete_owner",
    target_type: "owner",
    target_id: Number(id),
    details: { name: existing?.name, email: existing?.email },
  });

  res.status(200).json({ message: "Owner deleted successfully" });
});
