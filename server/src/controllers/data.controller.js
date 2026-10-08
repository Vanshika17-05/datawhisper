import { z } from "zod";
import { ALLOWED_COLLECTIONS, getCollectionModel } from "../services/queryExecutor.service.js";
const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(25) });
export async function getCollectionData(req, res) {
  if (!ALLOWED_COLLECTIONS.includes(req.params.collection)) return res.status(400).json({ error: "Collection is not allowed" });
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "Invalid pagination values" });
  const { page, limit } = parsed.data; const model = getCollectionModel(req.params.collection); const filter = {};
  const [data, total] = await Promise.all([model.find(filter).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).lean(), model.countDocuments(filter)]);
  res.json({ success: true, collection: req.params.collection, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
