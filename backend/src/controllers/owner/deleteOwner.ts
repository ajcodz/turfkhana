import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const deleteOwner = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("owners").delete().eq("id", id);

  if (error) return res.status(400).json({ error });

  res.status(200).json({ message: "Owner deleted successfully" });
});
