import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Owner } from "../../models/owner.model";

export const setOwnerStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active !== "boolean") {
    return res.status(400).json({ error: "is_active must be a boolean" });
  }

  const { data, error } = await supabase
    .from("owners")
    .update({ is_active })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Owner not found" });
  }

  res.status(200).json({ owner: data[0] as Owner });
});
