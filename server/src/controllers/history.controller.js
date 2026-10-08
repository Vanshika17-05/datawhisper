import { QueryHistory } from "../models/QueryHistory.js";
export async function getQueryHistory(req, res) {
  const records = await QueryHistory.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(10).select("question title chartType sourceCollection resultCount timestamp").lean();
  const history = records.map(({ sourceCollection, ...record }) => ({ ...record, collection: sourceCollection }));
  res.json({ success: true, history });
}
