import { supabase } from "../../db/config";
import { Turf } from "../../models/turf.model";
import { catchAsync } from "../../utils/catchAsync";

export const getTurfById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("turfs")
    .select("*, owners(is_active)")
    .eq("id", id)
    .single();

  if (error || !data) return res.status(404).json({ error: "Turf not found" });

  const row = data as any;

  // Unclaimed turfs have no owner to gate on; claimed ones stay hidden while
  // their owner is disabled.
  const ownerAllows = row.status === "unclaimed" || row.owners?.is_active;

  if (!ownerAllows || !row.is_active) {
    return res.status(404).json({ error: "Turf not found" });
  }

  const { owners, ...turf } = row;

  res.status(200).json({ turf: turf as Turf });
});
