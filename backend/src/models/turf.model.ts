import { BaseEntity } from "./base.model";

export interface Turf extends BaseEntity {
    owner_id: number;
    name: string;
    slug: string | null;
    type: string;
    address: string;
    lat: number | null;
    lng: number | null;
    opening_time: string;       // format: HH:MM:SS+TZ
    closing_time: string;       // format: HH:MM:SS+TZ
    slot_duration_minutes: number;
    price_per_slot: number;
    currency: string;
    booking_window_days: number;
}

export type CreateTurfDTO = Omit<Turf, "id" | "created_at">;