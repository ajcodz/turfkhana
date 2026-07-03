import { supabase } from "../../db/config";
import { Booking, CreateBookingDTO } from "../../models/booking.model";
import { catchAsync } from "../../utils/catchAsync";

export const createBooking = catchAsync(async (req, res) => {
    const {
        turf_id,
        date,
        start_time,
        end_time,
    } = req.body;

    // Check for overlapping bookings
    const { data: existingBookings, error: bookingCheckError } = await supabase
        .from("bookings")
        .select("*")
        .eq("turf_id", turf_id)
        .eq("date", date)
        .neq("status", "cancelled");

    if (bookingCheckError) return res.status(400).json({ error: bookingCheckError });

    const hasBookingConflict = existingBookings?.some((b) => {
        const bStart = b.start_time.substring(0, 8);
        const bEnd = b.end_time.substring(0, 8);
        const newStart = start_time.substring(0, 8);
        const newEnd = end_time.substring(0, 8);
        return bStart < newEnd && bEnd > newStart;
    });

    if (hasBookingConflict) {
        return res.status(409).json({
            error: "This time slot is already booked for the selected turf and date",
        });
    }

    // Check for overlapping closed hours
    const { data: closedHours, error: settingsCheckError } = await supabase
        .from("settings")
        .select("*")
        .eq("turf_id", turf_id)
        .eq("blocked_date", date);

    if (settingsCheckError) return res.status(400).json({ error: settingsCheckError });

    const hasClosedHourConflict = closedHours?.some((s) => {
        const cStart = (s.blocked_start_time ?? "00:00:00").substring(0, 8);
        const cEnd = (s.blocked_end_time ?? "23:59:59").substring(0, 8);
        const newStart = start_time.substring(0, 8);
        const newEnd = end_time.substring(0, 8);
        return cStart < newEnd && cEnd > newStart;
    });

    if (hasClosedHourConflict) {
        return res.status(409).json({
            error: "This time slot is not available due to a scheduled closure",
        });
    }

    // Check for expired slot (past time on today's date)
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
        const slotEndDateTime = new Date(`${date}T${end_time.substring(0, 8)}`);
        if (slotEndDateTime < new Date()) {
            return res.status(409).json({
                error: "This time slot has already expired",
            });
        }
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