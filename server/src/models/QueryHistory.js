import mongoose from "mongoose";
const queryHistorySchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true }, pipeline: { type: [mongoose.Schema.Types.Mixed], required: true },
  chartType: { type: String, required: true, enum: ["bar", "pie", "line", "table"] }, title: { type: String, required: true },
  sourceCollection: { type: String, required: true, enum: ["orders", "employees", "sales"] }, resultCount: { type: Number, required: true, min: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, timestamp: { type: Date, default: Date.now, index: true },
}, { versionKey: false });
export const QueryHistory = mongoose.models.QueryHistory || mongoose.model("QueryHistory", queryHistorySchema);
