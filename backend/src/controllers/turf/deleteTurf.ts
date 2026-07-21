import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const deleteTurf = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { data: turf, error: fetchError } = await supabase
    .from("turfs")
    .select("id, owner_id")
    .eq("id", id)
    .single();

  if (fetchError || !turf) {
    return res.status(404).json({ error: "Turf not found" });
  }

  // Owners may only delete their own turfs; super admins can delete any.
  if (req.user!.role === "owner" && turf.owner_id !== req.user!.id) {
    return res.status(403).json({ error: "You do not own this turf" });
  }

  const { count, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("turf_id", id);

  if (countError) return res.status(400).json({ error: countError });

  if (count && count > 0) {
    return res.status(409).json({
      error: `Cannot delete this turf — it has ${count} booking(s) on record. Disable it instead to hide it without losing booking history.`,
    });
  }

  const { error } = await supabase.from("turfs").delete().eq("id", id);

  if (error) return res.status(400).json({ error });

  res.status(200).json({ message: "Turf deleted successfully" });
});
