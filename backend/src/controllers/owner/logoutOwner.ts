import { Request, Response } from "express";

export const logoutOwner = (req: Request, res: Response) => {
  res.clearCookie("owner_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
