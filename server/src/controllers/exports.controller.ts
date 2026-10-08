import type { Request, Response } from "express";
import mongoose from "mongoose";
import { QueryHistory } from "../models/QueryHistory.js";
import { getExportDownloadUrl, uploadExport, type ExportFormat } from "../services/s3.service.js";

const formats = new Set<ExportFormat>(["png", "csv"]);

export async function createExport(req: Request, res: Response): Promise<void> {
  const queryHistoryId = Array.isArray(req.params.queryHistoryId) ? undefined : req.params.queryHistoryId;
  const rawFormat = Array.isArray(req.params.format) ? undefined : req.params.format;
  if (!queryHistoryId || !mongoose.isValidObjectId(queryHistoryId) || !formats.has(rawFormat as ExportFormat)) { res.status(400).json({ error: "Invalid export request" }); return; }
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) { res.status(400).json({ error: "Export file is empty" }); return; }
  const history = await QueryHistory.findOne({ _id: queryHistoryId, userId: req.user.id });
  if (!history) { res.status(404).json({ error: "Query history record not found" }); return; }
  try {
    const format = rawFormat as ExportFormat;
    const key = await uploadExport(req.user.id, queryHistoryId, format, req.body);
    history.exports = [...(history.exports ?? []).filter((item) => item.format !== format), { format, key, size: req.body.length, createdAt: new Date() }];
    await history.save();
    res.status(201).json({ success: true, key });
  } catch (error) {
    console.error("S3 export upload failed:", error instanceof Error ? error.message : error);
    res.status(502).json({ error: "Export storage is temporarily unavailable" });
  }
}

export async function getExports(req: Request, res: Response): Promise<void> {
  try {
    const records = await QueryHistory.find({ userId: req.user.id, "exports.0": { $exists: true } }).sort({ timestamp: -1 }).limit(50).select("title question exports").lean();
    const artifacts = records.flatMap((record) => (record.exports ?? []).map((artifact) => ({ ...artifact, queryHistoryId: String(record._id), title: record.title, question: record.question })));
    const exports = await Promise.all(artifacts.map(async (artifact) => ({ ...artifact, url: await getExportDownloadUrl(artifact.key, artifact.queryHistoryId, artifact.format) })));
    res.json({ success: true, exports: exports.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime()) });
  } catch (error) {
    console.error("S3 export listing failed:", error instanceof Error ? error.message : error);
    res.status(502).json({ error: "Export storage is temporarily unavailable" });
  }
}
