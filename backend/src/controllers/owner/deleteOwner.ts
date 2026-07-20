import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const deleteOwner = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { count, error: countError } = await supabase
    .from("turfs")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", id);

  if (countError) return res.status(400).json({ error: countError });

  if (count && count > 0) {
    return res.status(409).json({
      error: `Cannot delete this owner — they still have ${count} turf(s). Deactivate the owner instead, or remove/reassign their turfs first.`,
    });
  }

  const { error } = await supabase.from("owners").delete().eq("id", id);

  if (error) return res.status(400).json({ error });

  res.status(200).json({ message: "Owner deleted successfully" });
});
