import mongoose from "mongoose";
import type { UserDocument } from "../types/domain.js";

const userSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now, immutable: true },
}, { versionKey: false });

export const User = (mongoose.models.User as mongoose.Model<UserDocument> | undefined) || mongoose.model<UserDocument>("User", userSchema);
