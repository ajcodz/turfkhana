import { BaseEntity } from "./base.model";

export interface Owner extends BaseEntity {
  name: string;
  phone: string;
  email: string | null;
  password: string;
  is_active: boolean;
}

export type CreateOwnerDTO = Omit<Owner, "id" | "created_at">;
