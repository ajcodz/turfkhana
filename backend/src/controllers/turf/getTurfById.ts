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

  if (!(data as any).owners?.is_active) {
    return res.status(404).json({ error: "Turf not found" });
  }

  const { owners, ...turf } = data as any;

  res.status(200).json({ turf: turf as Turf });
});
