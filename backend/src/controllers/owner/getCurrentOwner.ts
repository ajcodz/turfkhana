import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getCurrentOwner = catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from("owners")
    .select("id, name, email, phone")
    .eq("id", req.user!.id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Owner not found" });
  }

  res.status(200).json({ owner: data });
});
