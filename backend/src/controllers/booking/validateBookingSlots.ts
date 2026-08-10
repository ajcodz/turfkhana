import { supabase } from "../../db/config";

export interface BookingSlotInput {
  start_time: string; // format: HH:MM:SS (a trailing timezone offset is ignored)
  end_time: string;
}

export interface SlotValidationFailure {
  status: number;
  message: string;
}

// Times come back from Postgres as "HH:MM:SS+TZ"; everything here compares the
// plain "HH:MM:SS" prefix as a string, which sorts correctly for a single day.
const clip = (time: string) => time.substring(0, 8);

const overlaps = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) => aStart < bEnd && aEnd > bStart;

/**
 * Validates one or more slots for the same turf and date against existing
 * bookings, scheduled closures, expiry and the turf's opening hours.
 * Resolves to null when every slot is bookable, otherwise to the first failure.
 */
export const validateBookingSlots = async (
  turf_id: number | string,
  date: string,
  slots: BookingSlotInput[],
): Promise<SlotValidationFailure | null> => {
  if (!Array.isArray(slots) || slots.length === 0) {
    return { status: 400, message: "At least one time slot is required" };
  }

  if (slots.some((s) => !s?.start_time || !s?.end_time)) {
    return { status: 400, message: "Each time slot needs a start and end time" };
  }

  const normalized = slots.map((s) => ({
    start: clip(s.start_time),
    end: clip(s.end_time),
  }));

  // The requested slots must not overlap one another
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const a = normalized[i];
      const b = normalized[j];
      if (overlaps(a.start, a.end, b.start, b.end)) {
        return {
          status: 400,
          message: "The selected time slots overlap each other",
        };
      }
    }
  }

  const { data: existingBookings, error: bookingCheckError } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .eq("turf_id", turf_id)
    .eq("date", date)
    .neq("status", "cancelled");

  if (bookingCheckError) {
    return { status: 400, message: bookingCheckError.message };
  }

  const { data: closedHours, error: settingsCheckError } = await supabase
    .from("settings")
    .select("blocked_start_time, blocked_end_time")
    .eq("turf_id", turf_id)
    .eq("blocked_date", date);

  if (settingsCheckError) {
    return { status: 400, message: settingsCheckError.message };
  }

  const { data: turfData, error: turfError } = await supabase
    .from("turfs")
    .select("opening_time, closing_time")
    .eq("id", turf_id)
    .single();

  if (turfError || !turfData) {
    return { status: 404, message: "Turf not found" };
  }

  const turfOpen = clip(turfData.opening_time);
  const turfClose = clip(turfData.closing_time);
  const now = new Date();

  for (const slot of normalized) {
    const label = `${slot.start.substring(0, 5)} - ${slot.end.substring(0, 5)}`;

    const hasBookingConflict = existingBookings?.some((b) =>
      overlaps(clip(b.start_time), clip(b.end_time), slot.start, slot.end),
    );

    if (hasBookingConflict) {
      return {
        status: 409,
        message: `The ${label} slot is already booked for the selected turf and date`,
      };
    }

    const hasClosedHourConflict = closedHours?.some((s) =>
      overlaps(
        clip(s.blocked_start_time ?? "00:00:00"),
        clip(s.blocked_end_time ?? "23:59:59"),
        slot.start,
        slot.end,
      ),
    );

    if (hasClosedHourConflict) {
      return {
        status: 409,
        message: `The ${label} slot is not available due to a scheduled closure`,
      };
    }

    // Catches both a slot earlier today and any slot on a date that has
    // already passed. The previous "only check when date === today" guard
    // compared a UTC date against a locally-built one, so it skipped entirely
    // whenever the two disagreed — which let bookings through for past dates.
    if (new Date(`${date}T${slot.end}`) < now) {
      return {
        status: 409,
        message: `The ${label} slot has already expired`,
      };
    }

    if (slot.start < turfOpen) {
      return {
        status: 409,
        message: `This turf opens at ${turfOpen.substring(0, 5)}. Booking cannot be made before opening time`,
      };
    }

    if (slot.end > turfClose) {
      return {
        status: 409,
        message: `This turf closes at ${turfClose.substring(0, 5)}. Booking cannot be made after closing time`,
      };
    }
  }

  return null;
};
