import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Turf, CreateTurfDTO } from "../../models/turf.model";

export const createTurf = catchAsync(async (req, res) => {
    const turfData: CreateTurfDTO = {
        owner_id: req.body.owner_id,
        name: req.body.name,
        slug: req.body.slug ?? null,
        type: req.body.type,
        address: req.body.address,
        lat: req.body.lat ?? null,
        lng: req.body.lng ?? null,
        opening_time: req.body.opening_time,
        closing_time: req.body.closing_time,
        slot_duration_minutes: req.body.slot_duration_minutes ?? 60,
        price_per_slot: req.body.price_per_slot,
        currency: req.body.currency ?? "PKR",
        booking_window_days: req.body.booking_window_days ?? 30,
    };

    const { data, error } = await supabase
        .from("turfs")
        .insert([turfData])
        .select();

    if (error) return res.status(400).json({ error });

    res.status(201).json({ turf: data[0] as Turf });
});