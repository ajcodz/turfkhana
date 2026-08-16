import type { BaseEntity } from "./base.model";

/** "unclaimed" turfs are directory listings seeded without an owner account. */
export type TurfStatus = "claimed" | "unclaimed";

export interface Turf extends BaseEntity {
  owner_id: number | null;
  name: string;
  slug: string | null;
  type: string;
  address: string;
  phone: string | null;
  google_maps_url: string | null;
  lat: number | null;
  lng: number | null;
  opening_time: string; // format: HH:MM:SS+TZ
  closing_time: string; // format: HH:MM:SS+TZ
  slot_duration_minutes: number;
  price_per_slot: number;
  currency: string;
  booking_window_days: number;
  is_active: boolean;
  status: TurfStatus;
}

export type CreateTurfDTO = Omit<
  Turf,
  "id" | "created_at" | "is_active" | "status"
>;
