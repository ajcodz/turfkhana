export type UserRole = "owner" | "super_admin";

export interface AuthTokenPayload {
  id: number;
  role: UserRole;
}
