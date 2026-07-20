import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getAllTurfs = catchAsync(async (req, res) => {
  const { owner_id } = req.query;

  let query = supabase
    .from("turfs")
    .select("*, owners!inner(is_active)")
    .eq("owners.is_active", true);

  if (owner_id) {
    query = query.eq("owner_id", Number(owner_id));
  }

  const { data, error } = await query;

  if (error) return res.status(400).json({ error });

  // Strip the joined owners field before returning — callers only expect turf fields
  const turfs = (data ?? []).map(({ owners, ...turf }: any) => turf);

  res.json({ turfs });
});
