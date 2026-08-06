import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getAllTurfsForSuperAdmin = catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from("turfs")
    .select("*, owners(id, name, is_active)")
    .order("id", { ascending: true });

  if (error) return res.status(400).json({ error });

  const turfs = (data ?? []).map((row: any) => {
    const { owners, ...turf } = row;
    return {
      ...turf,
      owner_name: owners?.name ?? "Unknown",
      owner_is_active: owners?.is_active ?? false,
    };
  });

  res.json({ turfs });
});
