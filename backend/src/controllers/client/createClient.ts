import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Client, CreateClientDTO } from "../../models/client.model";

export const createClient = catchAsync(async (req, res) => {
    const clientData: CreateClientDTO = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email ?? null,
    };

    const { data, error } = await supabase
        .from("clients")
        .insert([clientData])
        .select();

    if (error) return res.status(400).json({ error });

    res.status(201).json({ client: data[0] as Client });
});