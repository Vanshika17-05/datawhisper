import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true }, customerName: { type: String, required: true, trim: true },
  city: { type: String, required: true, enum: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"], index: true },
  product: { type: String, required: true }, category: { type: String, required: true, enum: ["Electronics", "Home", "Fashion", "Beauty", "Sports"] },
  quantity: { type: Number, required: true, min: 1 }, amount: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: ["pending", "shipped", "delivered", "cancelled"], index: true }, orderDate: { type: Date, required: true, index: true },
}, { versionKey: false });
export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
