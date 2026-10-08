import { z } from "zod";
import { QueryHistory } from "../models/QueryHistory.js";
import { generateQueryPlan } from "../services/gemini.service.js";
import { executeQuery } from "../services/queryExecutor.service.js";
import type { Request, Response } from "express";
import { embedQuestion } from "../services/embedding.service.js";
import type { QueryAnalyticsContext } from "../analytics/queryLogging.middleware.js";

const questionSchema = z.string().trim().min(3).max(500);
export async function runQuery(req: Request, res: Response): Promise<void> {
  const analytics = res.locals.queryAnalytics as QueryAnalyticsContext;
  const parsed = questionSchema.safeParse(req.body?.question);
  if (!parsed.success) { res.json({ success: false, message: "Please ask a clear question between 3 and 500 characters." }); return; }
  const question = parsed.data;
  analytics.question = question;
  const plan = await generateQueryPlan(question);
  if (!plan.success) { res.json({ success: false, message: plan.message }); return; }
  analytics.collection = plan.collection;
  analytics.chartType = plan.chartType;
  const result = await executeQuery(plan.collection, plan.pipeline);
  if (!result.success) { res.json({ success: false, message: `I couldn't safely run that query: ${result.error}. Try rephrasing it.` }); return; }
  analytics.success = true;
  let queryHistoryId: string | null = null;
  try {
    const history = await QueryHistory.create({ question, pipeline: result.pipeline, chartType: plan.chartType, title: plan.title, sourceCollection: plan.collection, resultCount: result.data.length, userId: req.user.id });
    queryHistoryId = history.id;
    try {
      history.embedding = await embedQuestion(question);
      await history.save();
    } catch (error) { console.error("Could not embed query history:", error instanceof Error ? error.message : error); }
  } catch (error) { console.error("Could not save query history:", error instanceof Error ? error.message : error); }
  res.json({ success: true, question, title: plan.title, chartType: plan.chartType, collection: plan.collection, queryHistoryId, data: result.data });
}
