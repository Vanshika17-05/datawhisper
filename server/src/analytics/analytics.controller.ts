import type { Request, Response } from "express";
import { getAnalyticsSummary } from "./analytics.service.js";

export async function analyticsSummary(req: Request, res: Response): Promise<void> {
  const summary = await getAnalyticsSummary(req.user.id);
  res.json({ success: true, summary });
}
