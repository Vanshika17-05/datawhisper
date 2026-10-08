import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

interface HttpError extends Error { status?: number; code?: number; details?: unknown }
export function errorHandler(error: HttpError, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) { next(error); return; }
  if (error.code === 11000) { res.status(400).json({ error: "An account with this email already exists" }); return; }
  if (!error.status) console.error(error);
  res.status(error.status ?? 500).json({
    error: error.status ? error.message : "Internal server error",
    ...(error.details ? { details: error.details } : {}),
  });
}
