import { BaseEntity } from "./base.model";

export interface Client extends BaseEntity {
  name: string;
  phone: string;
  email: string | null;
  password: string;
}

export type CreateClientDTO = Omit<Client, "id" | "created_at">;
