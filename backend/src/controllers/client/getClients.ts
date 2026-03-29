import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getClients = catchAsync(async (req, res) => {
    const { data, error } = await supabase.from("clients").select("*");

    if (error) return res.status(400).json({ error });

    res.json({ clients: data });
});