import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const createTurf = catchAsync(async (req, res) => {
    const { name, location, price_per_hour, opening_time, closing_time } = req.body;

    const { data, error } = await supabase
        .from("turfs")
        .insert([{ name, location, price_per_hour, opening_time, closing_time }])
        .select();

    if (error) return res.status(400).json({ error });

    res.json({ turf: data[0] });
});