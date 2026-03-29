import { BaseEntity } from "./base.model";

export interface Booking extends BaseEntity {
    client_id: number;
    turf_id: number;
    date: string;           // format: YYYY-MM-DD
    start_time: string;     // format: HH:MM:SS
    end_time: string;       // format: HH:MM:SS
    duration_minutes: number;
    price: number;
    status: string | null;
    payment_method: string | null;
    payment_status: string | null;
    payment_transaction_id: string | null;
}

// Only the fields you insert (excludes auto-managed: id, created_at)
export type CreateBookingDTO = Omit<Booking, "id" | "created_at">;