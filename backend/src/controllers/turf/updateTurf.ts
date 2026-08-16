import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Turf } from "../../models/turf.model";

export const updateTurf = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { data: existing, error: fetchError } = await supabase
    .from("turfs")
    .select("id, owner_id, is_active")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: "Turf not found" });
  }

  // Owners may only edit their own turfs; super admins can edit any.
  if (req.user!.role === "owner") {
    if (existing.owner_id !== req.user!.id) {
      return res.status(403).json({ error: "You do not own this turf" });
    }
    if (!existing.is_active) {
      return res.status(403).json({
        error:
          "This turf has been disabled by a super admin and cannot be edited.",
      });
    }
  }

  const updateData = {
    owner_id: req.body.owner_id,
    name: req.body.name,
    slug: req.body.slug ?? null,
    type: req.body.type,
    address: req.body.address,
    phone: req.body.phone ?? null,
    google_maps_url: req.body.google_maps_url ?? null,
    lat: req.body.lat ?? null,
    lng: req.body.lng ?? null,
    opening_time: req.body.opening_time,
    closing_time: req.body.closing_time,
    slot_duration_minutes: req.body.slot_duration_minutes ?? 60,
    price_per_slot: req.body.price_per_slot,
    currency: req.body.currency ?? "PKR",
    booking_window_days: req.body.booking_window_days ?? 30,
  };

  const { data, error } = await supabase
    .from("turfs")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  res.status(200).json({ turf: data[0] as Turf });
});
