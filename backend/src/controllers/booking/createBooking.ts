import { supabase } from "../../db/config";
import { Booking, CreateBookingDTO } from "../../models/booking.model";
import { catchAsync } from "../../utils/catchAsync";
import { validateBookingSlots } from "./validateBookingSlots";

export const createBooking = catchAsync(async (req, res) => {
  const { turf_id, date, start_time, end_time } = req.body;

  const failure = await validateBookingSlots(turf_id, date, [
    { start_time, end_time },
  ]);

  if (failure) {
    return res.status(failure.status).json({ error: failure.message });
  }

  const bookingData: CreateBookingDTO = {
    client_id: req.body.client_id,
    turf_id,
    date,
    start_time,
    end_time,
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
