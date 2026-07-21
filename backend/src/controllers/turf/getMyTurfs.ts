import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getMyTurfs = catchAsync(async (req, res) => {
  const ownerId = req.user!.id;

  const { data, error } = await supabase
    .from("turfs")
    .select("*")
    .eq("owner_id", ownerId)
    .order("id", { ascending: true });

  if (error) return res.status(400).json({ error });

  res.json({ turfs: data });
});
