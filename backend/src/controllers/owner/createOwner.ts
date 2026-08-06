import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Owner, CreateOwnerDTO } from "../../models/owner.model";
import { logAuditEvent } from "../../utils/auditLog";

export const createOwner = catchAsync(async (req, res) => {
  const ownerData: CreateOwnerDTO = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email ?? null,
    password: req.body.password,
  };

  const { data, error } = await supabase
    .from("owners")
    .insert([ownerData])
    .select();

  if (error) return res.status(400).json({ error });

  const created = data[0] as Owner;

  await logAuditEvent(req, {
    action: "create_owner",
    target_type: "owner",
    target_id: created.id,
    details: { name: created.name, email: created.email },
  });

  res.status(201).json({ owner: created });
});
