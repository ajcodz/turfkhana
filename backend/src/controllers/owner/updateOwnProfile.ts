import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Owner } from "../../models/owner.model";

export const updateOwnProfile = catchAsync(async (req, res) => {
  const ownerId = req.user!.id;

  // If changing the password, require the current password as confirmation —
  // this is self-service, so we don't want a hijacked session (e.g. an
  // unlocked browser) to be able to silently lock the real owner out.
  if (req.body.password) {
    const { data: existing, error: fetchError } = await supabase
      .from("owners")
      .select("password")
      .eq("id", ownerId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (existing.password !== req.body.currentPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
  }

  const updateData = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email ?? null,
    password: req.body.password,
  };

  const { data, error } = await supabase
    .from("owners")
    .update(updateData)
    .eq("id", ownerId)
    .select();

  if (error) return res.status(400).json({ error });

  const updatedOwner = data[0] as Owner;

  res.status(200).json({
    owner: {
      id: updatedOwner.id,
      name: updatedOwner.name,
      email: updatedOwner.email,
      phone: updatedOwner.phone,
    },
  });
});
