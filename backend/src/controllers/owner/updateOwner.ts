import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Owner } from "../../models/owner.model";
import { logAuditEvent } from "../../utils/auditLog";

export const updateOwner = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updateData = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email ?? null,
    password: req.body.password,
  };

  const { data, error } = await supabase
    .from("owners")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  const updated = data[0] as Owner;

  await logAuditEvent(req, {
    action: "update_owner",
    target_type: "owner",
    target_id: updated.id,
    details: { name: updated.name, email: updated.email, phone: updated.phone },
  });

  res.status(200).json({ owner: updated });
});
