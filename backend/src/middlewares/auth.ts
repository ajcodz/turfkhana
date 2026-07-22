import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UserRole } from "../models/auth.model";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: UserRole };
      identities?: { id: number; role: UserRole }[];
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const identities: { id: number; role: UserRole }[] = [];

  if (req.cookies?.owner_token) {
    try {
      const payload = verifyToken(req.cookies.owner_token);
      identities.push({ id: payload.id, role: payload.role });
    } catch {
      // ignore invalid/expired owner cookie, try the other one
    }
  }

  if (req.cookies?.super_admin_token) {
    try {
      const payload = verifyToken(req.cookies.super_admin_token);
      identities.push({ id: payload.id, role: payload.role });
    } catch {
      // ignore invalid/expired super admin cookie
    }
  }

  if (identities.length === 0) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.identities = identities;
  req.user = identities[0]; // sensible default for routes that don't call requireRole
  next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const identities = req.identities ?? (req.user ? [req.user] : []);
    const match = identities.find((identity) => roles.includes(identity.role));

    if (!match) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = match;
    next();
  };
};
