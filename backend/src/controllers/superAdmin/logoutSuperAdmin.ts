import { Request, Response } from "express";

export const logoutSuperAdmin = (req: Request, res: Response) => {
  res.clearCookie("super_admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
