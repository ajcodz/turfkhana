import { supabase } from "../../db/config";
import { Booking, CreateBookingDTO } from "../../models/booking.model";
import { catchAsync } from "../../utils/catchAsync";

export const createBooking = catchAsync(async (req, res) => {
    const bookingData: CreateBookingDTO = {
        client_id: req.body.client_id,
        turf_id: req.body.turf_id,
        date: req.body.date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        duration_minutes: req.body.duration_minutes ?? 60,
        price: req.body.price,
        status: req.body.status ?? null,
        payment_method: req.body.payment_method ?? null,
        payment_status: req.body.payment_status ?? null,
        payment_transaction_id: req.body.payment_transaction_id ?? null,
    };

    const { data, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select();

    if (error) return res.status(400).json({ error });

    res.status(201).json({ booking: data[0] as Booking });
});