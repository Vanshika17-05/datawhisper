import mongoose from "mongoose";
const saleSchema = new mongoose.Schema({
  region: { type: String, required: true, enum: ["North", "South", "East", "West", "Central"], index: true }, product: { type: String, required: true },
  category: { type: String, required: true, enum: ["Electronics", "Home", "Fashion", "Beauty", "Sports"] }, revenue: { type: Number, required: true, min: 0 },
  unitsSold: { type: Number, required: true, min: 1 }, quarter: { type: String, required: true, enum: ["Q1", "Q2", "Q3", "Q4"] }, saleDate: { type: Date, required: true, index: true },
}, { versionKey: false });
export const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
