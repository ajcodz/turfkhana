import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Owner, CreateOwnerDTO } from "../../models/owner.model";

export const createOwner = catchAsync(async (req, res) => {
    const ownerData: CreateOwnerDTO = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email ?? null,
    };

    const { data, error } = await supabase
        .from("owners")
        .insert([ownerData])
        .select();

    if (error) return res.status(400).json({ error });

    res.status(201).json({ owner: data[0] as Owner });
});