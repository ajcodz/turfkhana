import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getAllTurfs = catchAsync(async (req, res) => {
    const { data, error } = await supabase.from("turfs").select("*");

    if (error) return res.status(400).json({ error });

    res.json({ turfs: data });
});