import { BaseEntity } from "./base.model";

export interface Setting extends BaseEntity {
    turf_id: number;
    blocked_date: string;           // format: YYYY-MM-DD
    blocked_start_time: string | null;  // format: HH:MM:SS+TZ
    blocked_end_time: string | null;    // format: HH:MM:SS+TZ
}

export type CreateSettingDTO = Omit<Setting, "id" | "created_at">;