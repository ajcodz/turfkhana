import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getOwners = catchAsync(async (req, res) => {
    const { data, error } = await supabase.from("owners").select("*");

    if (error) return res.status(400).json({ error });

    res.json({ owners: data });
});