import { QueryHistory } from "../models/QueryHistory.js";
import type { Request, Response } from "express";
import { z } from "zod";
import { embedQuestion } from "../services/embedding.service.js";

const similarQuestionSchema = z.object({ question: z.string().trim().min(3).max(500) });
export async function getQueryHistory(req: Request, res: Response): Promise<void> {
  const records = await QueryHistory.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(10).select("question title chartType sourceCollection resultCount timestamp").lean();
  const history = records.map(({ sourceCollection, ...record }) => ({ ...record, collection: sourceCollection }));
  res.json({ success: true, history });
}

export async function getSimilarQuestions(req: Request, res: Response): Promise<void> {
  const parsed = similarQuestionSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ success: false, message: "Question must be between 3 and 500 characters." }); return; }

  const queryVector = await embedQuestion(parsed.data.question);
  const similar = await QueryHistory.aggregate<{ _id: string; question: string; title: string; chartType: string; timestamp: Date; score: number }>([
    {
      $vectorSearch: {
        index: "query_history_embedding",
        path: "embedding",
        queryVector,
        numCandidates: 50,
        limit: 3,
        filter: { userId: req.user._id },
      },
    },
    { $project: { question: 1, title: 1, chartType: 1, timestamp: 1, score: { $meta: "vectorSearchScore" } } },
  ]);
  res.json({ success: true, similar });
}
