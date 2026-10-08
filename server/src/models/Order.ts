import mongoose from "mongoose";
import type { OrderDocument } from "../types/domain.js";
const orderSchema = new mongoose.Schema<OrderDocument>({
  orderId: { type: String, required: true, unique: true, index: true }, customerName: { type: String, required: true, trim: true },
  city: { type: String, required: true, enum: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"], index: true },
  product: { type: String, required: true }, category: { type: String, required: true, enum: ["Electronics", "Home", "Fashion", "Beauty", "Sports"] },
  quantity: { type: Number, required: true, min: 1 }, amount: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: ["pending", "shipped", "delivered", "cancelled"], index: true }, orderDate: { type: Date, required: true, index: true },
}, { versionKey: false });
export const Order = (mongoose.models.Order as mongoose.Model<OrderDocument> | undefined) || mongoose.model<OrderDocument>("Order", orderSchema);
