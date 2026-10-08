import { z } from "zod";
import { ALLOWED_COLLECTIONS, getCollectionModel } from "../services/queryExecutor.service.js";
import { isCollectionName } from "../services/queryExecutor.service.js";
import type { Request, Response } from "express";
const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(25) });
export async function getCollectionData(req: Request, res: Response): Promise<void> {
  if (!isCollectionName(req.params.collection)) { res.status(400).json({ error: "Collection is not allowed" }); return; }
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid pagination values" }); return; }
  const { page, limit } = parsed.data; const model = getCollectionModel(req.params.collection); const filter = {};
  const [data, total] = await Promise.all([model.find(filter).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).lean(), model.countDocuments(filter)]);
  res.json({ success: true, collection: req.params.collection, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
