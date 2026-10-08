import { User } from "../models/User.js";
import { verifyToken } from "../services/auth.service.js";
import type { NextFunction, Request, Response } from "express";

function unauthorized(message = "Authentication required"): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.status = 401;
  return error;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) throw unauthorized();

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw unauthorized("Account not found");

    req.user = user;
    req.auth = payload;
    next();
  } catch (error) {
    next(error instanceof Error && "status" in error ? error : unauthorized("Invalid or expired token"));
  }
}
