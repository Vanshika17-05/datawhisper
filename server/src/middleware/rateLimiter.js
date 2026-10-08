import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false });
export const queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip),
  handler: (req, res) => res.status(429).json({ success: false, message: "Query limit reached. Please try again in a few minutes." }),
});
