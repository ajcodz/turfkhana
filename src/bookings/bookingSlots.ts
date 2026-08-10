export interface BookingSlot {
  /** Human readable range, e.g. "06:00 PM - 07:00 PM" */
  time: string;
  /** 24h start, e.g. "18:00:00" */
  startTime: string;
  /** 24h end, e.g. "19:00:00" */
  endTime: string;
}

/** Router state handed from the turf details page to the booking form. */
export interface BookingLocationState {
  turfId: string | number;
  turfName: string;
  turfImage: string;
  location: string;
  /** Date#toDateString(), e.g. "Wed May 10 2026" */
  date: string;
  slots: BookingSlot[];
  slotDurationMinutes: number;
  pricePerSlot: number;
  currency: string;
}

/** "18:00:00" → "06:00 PM" */
export const formatTime12 = (time24: string): string => {
  const [hoursStr, minutes] = time24.split(":");
  const hours = Number(hoursStr);
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${minutes ?? "00"} ${meridiem}`;
};

export const formatSlotRange = (startTime: string, endTime: string): string =>
  `${formatTime12(startTime)} - ${formatTime12(endTime)}`;

/**
 * Slots have to survive a round trip through PayFast, which bounces the browser
 * back to a URL we hand it — so they travel as a compact query param rather than
 * as router state: "18:00:00-19:00:00,19:00:00-20:00:00".
 */
export const encodeSlots = (slots: BookingSlot[]): string =>
  slots.map((s) => `${s.startTime}-${s.endTime}`).join(",");

export const decodeSlots = (raw: string | null): BookingSlot[] => {
  if (!raw) return [];

  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [startTime, endTime] = pair.split("-");
      if (!startTime || !endTime) return null;
      return {
        startTime,
        endTime,
        time: formatSlotRange(startTime, endTime),
      };
    })
    .filter((slot): slot is BookingSlot => slot !== null);
};

/** Chronological order, so summaries and receipts always read top to bottom. */
export const sortSlots = (slots: BookingSlot[]): BookingSlot[] =>
  [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
