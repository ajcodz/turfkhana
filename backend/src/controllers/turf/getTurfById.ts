import { supabase } from "../../db/config";
import { Turf } from "../../models/turf.model";
import { catchAsync } from "../../utils/catchAsync";

export const getTurfById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("turfs")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return res.status(404).json({ error: "Turf not found" });

    res.status(200).json({ turf: data as Turf });
});