import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getSettings = catchAsync(async (req, res) => {
    const { data, error } = await supabase.from("settings").select("*");

    if (error) return res.status(400).json({ error });

    res.json({ settings: data });
});