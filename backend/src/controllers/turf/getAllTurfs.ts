import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Turf } from "../../models/turf.model";

type TurfRow = Turf & { owners: { is_active: boolean } | null };

export const getAllTurfs = catchAsync(async (req, res) => {
  const { owner_id } = req.query;

  // Left join, not inner: unclaimed turfs are directory listings with no owner
  // row to join against, and they still belong in the public list.
  let query = supabase
    .from("turfs")
    .select("*, owners(is_active)")
    .eq("is_active", true);

  if (owner_id) {
    query = query.eq("owner_id", Number(owner_id));
  }

  const { data, error } = await query;

  if (error) return res.status(400).json({ error });

  const turfs = ((data ?? []) as unknown as TurfRow[])
    .filter((row) => row.status === "unclaimed" || row.owners?.is_active)
    .map(({ owners, ...turf }) => turf);

  res.json({ turfs });
});
