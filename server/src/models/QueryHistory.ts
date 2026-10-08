import mongoose from "mongoose";
import type { QueryHistoryDocument } from "../types/domain.js";
const queryHistorySchema = new mongoose.Schema<QueryHistoryDocument>({
  question: { type: String, required: true, trim: true }, pipeline: { type: [mongoose.Schema.Types.Mixed], required: true },
  chartType: { type: String, required: true, enum: ["bar", "pie", "line", "table"] }, title: { type: String, required: true },
  sourceCollection: { type: String, required: true, enum: ["orders", "employees", "sales"] }, resultCount: { type: Number, required: true, min: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, timestamp: { type: Date, default: Date.now, index: true },
  embedding: { type: [Number], select: false },
  exports: [{
    _id: false,
    format: { type: String, required: true, enum: ["png", "csv"] },
    key: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
  }],
}, { versionKey: false });

/*
Create this Atlas Vector Search index on the QueryHistory collection, named
`query_history_embedding` (Atlas UI: Search & Vector Search > Create Index > JSON Editor):
{
  "fields": [
    { "type": "vector", "path": "embedding", "numDimensions": 768, "similarity": "cosine" },
    { "type": "filter", "path": "userId" }
  ]
}
*/
export const QueryHistory = (mongoose.models.QueryHistory as mongoose.Model<QueryHistoryDocument> | undefined) || mongoose.model<QueryHistoryDocument>("QueryHistory", queryHistorySchema);
