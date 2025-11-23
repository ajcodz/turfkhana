import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getBookings = catchAsync(async (req, res) => {
    const { data, error } = await supabase.from("bookings").select("*");

    if (error) return res.status(400).json({ error });

    res.json({ bookings: data });
});