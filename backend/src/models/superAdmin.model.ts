import { BaseEntity } from "./base.model";

export interface SuperAdmin extends BaseEntity {
  name: string;
  email: string;
  password: string;
}
