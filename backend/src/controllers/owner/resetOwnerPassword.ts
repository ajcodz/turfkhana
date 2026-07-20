import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const resetOwnerPassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  const { data, error } = await supabase
    .from("owners")
    .update({ password })
    .eq("id", id)
    .select("id, name, email, phone");

  if (error) return res.status(400).json({ error });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Owner not found" });
  }

  res.status(200).json({ owner: data[0] });
});
