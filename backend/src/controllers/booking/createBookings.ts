import { supabase } from "../../db/config";
import { Booking, CreateBookingDTO } from "../../models/booking.model";
import { catchAsync } from "../../utils/catchAsync";
import { validateBookingSlots } from "./validateBookingSlots";

/**
 * Creates several bookings for the same turf, date and client in one request —
 * one row per selected slot. Every slot is validated before anything is
 * inserted, so a single unavailable slot rejects the whole request rather than
 * leaving the customer with a partial booking they already paid for.
 */
export const createBookings = catchAsync(async (req, res) => {
  const { client_id, turf_id, date, slots } = req.body;

  const failure = await validateBookingSlots(turf_id, date, slots ?? []);
  if (failure) {
    return res.status(failure.status).json({ error: failure.message });
  }

  const bookingRows: CreateBookingDTO[] = slots.map((slot: any) => ({
    client_id,
    turf_id,
    date,
    start_time: slot.start_time,
    end_time: slot.end_time,
    duration_minutes: slot.duration_minutes ?? req.body.duration_minutes ?? 60,
    price: slot.price ?? req.body.price_per_slot,
    status: req.body.status ?? null,
    payment_method: req.body.payment_method ?? null,
    payment_status: req.body.payment_status ?? null,
    payment_transaction_id: req.body.payment_transaction_id ?? null,
  }));

  const { data, error } = await supabase
    .from("bookings")
    .insert(bookingRows)
    .select();

  if (error) return res.status(400).json({ error });

  res.status(201).json({ bookings: data as Booking[] });
});
