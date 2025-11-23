import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const createBooking = catchAsync(async (req, res) => {
    const { user_name, phone, turf_id, slot_id, amount } = req.body;

    // Create booking entry
    const { data, error } = await supabase
        .from("bookings")
        .insert([{ user_name, phone, turf_id, slot_id, amount }])
        .select();

    if (error) return res.status(400).json({ error });

    res.json({ booking: data[0] });
});