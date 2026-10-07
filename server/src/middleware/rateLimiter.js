import { rateLimit } from "express-rate-limit";

export const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false });
export const queryLimiter = rateLimit({ windowMs: 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });
