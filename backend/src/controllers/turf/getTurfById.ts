import { supabase } from "../../db/config";
import { Turf } from "../../models/turf.model";
import { catchAsync } from "../../utils/catchAsync";

export const getTurfById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("turfs")
    .select("*, owners!inner(is_active)")
    .eq("id", id)
    .single();

  if (error || !data) return res.status(404).json({ error: "Turf not found" });

  const row = data as any;

  if (!row.owners?.is_active || !row.is_active) {
    return res.status(404).json({ error: "Turf not found" });
  }

  const { owners, ...turf } = row;

  res.status(200).json({ turf: turf as Turf });
});
