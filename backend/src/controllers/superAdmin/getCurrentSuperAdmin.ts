import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getCurrentSuperAdmin = catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from("super_admins")
    .select("id, name, email")
    .eq("id", req.user!.id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Super admin not found" });
  }

  res.status(200).json({ superAdmin: data });
});
