import { z } from "zod";
import { QueryHistory } from "../models/QueryHistory.js";
import { generateQueryPlan } from "../services/gemini.service.js";
import { executeQuery } from "../services/queryExecutor.service.js";

const questionSchema = z.string().trim().min(3).max(500);
export async function runQuery(req, res) {
  const parsed = questionSchema.safeParse(req.body?.question);
  if (!parsed.success) return res.json({ success: false, message: "Please ask a clear question between 3 and 500 characters." });
  const question = parsed.data;
  const plan = await generateQueryPlan(question);
  if (!plan.success) return res.json({ success: false, message: plan.message });
  const result = await executeQuery(plan.collection, plan.pipeline);
  if (!result.success) return res.json({ success: false, message: `I couldn't safely run that query: ${result.error}. Try rephrasing it.` });
  try {
    await QueryHistory.create({ question, pipeline: result.pipeline, chartType: plan.chartType, title: plan.title, sourceCollection: plan.collection, resultCount: result.data.length, userId: req.user.id });
  } catch (error) { console.error("Could not save query history:", error.message); }
  return res.json({ success: true, question, title: plan.title, chartType: plan.chartType, collection: plan.collection, data: result.data });
}
