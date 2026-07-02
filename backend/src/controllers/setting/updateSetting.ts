import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Setting } from "../../models/setting.model";

export const updateSetting = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updateData = {
    turf_id: req.body.turf_id,
    blocked_date: req.body.blocked_date,
    blocked_start_time: req.body.blocked_start_time ?? null,
    blocked_end_time: req.body.blocked_end_time ?? null,
  };

  const { data, error } = await supabase
    .from("settings")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  res.status(200).json({ setting: data[0] as Setting });
});
