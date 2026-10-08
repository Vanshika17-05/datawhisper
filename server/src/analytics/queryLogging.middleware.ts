import type { NextFunction, Request, Response } from "express";
import { logQuery } from "./analytics.service.js";

export interface QueryAnalyticsContext {
  question: string;
  collection: string;
  chartType: string;
  success: boolean;
}

export function queryAnalyticsLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = performance.now();
  const context: QueryAnalyticsContext = {
    question: typeof req.body?.question === "string" ? req.body.question.trim().slice(0, 500) : "",
    collection: "unknown",
    chartType: "unknown",
    success: false,
  };
  res.locals.queryAnalytics = context;
  res.once("finish", () => logQuery({
    userId: req.user.id,
    ...context,
    responseTimeMs: Math.max(0, Math.round(performance.now() - startedAt)),
  }));
  next();
}
