import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getBookings = catchAsync(async (req, res) => {
  const { turf_ids } = req.query;

  let query = supabase.from("bookings").select("*");

  if (turf_ids && typeof turf_ids === "string") {
    const ids = turf_ids
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    if (ids.length > 0) {
      query = query.in("turf_id", ids);
    }
  }

  const { data, error } = await query;

  if (error) return res.status(400).json({ error });

  res.json({ bookings: data });
});
