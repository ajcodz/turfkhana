import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getAllTurfs = catchAsync(async (req, res) => {
  const { owner_id } = req.query;

  let query = supabase.from("turfs").select("*");

  if (owner_id) {
    query = query.eq("owner_id", Number(owner_id));
  }

  const { data, error } = await query;

  if (error) return res.status(400).json({ error });

  res.json({ turfs: data });
});
