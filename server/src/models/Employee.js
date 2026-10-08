import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, department: { type: String, required: true, enum: ["Engineering", "Sales", "Marketing", "HR", "Support"], index: true },
  role: { type: String, required: true }, city: { type: String, required: true, enum: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"] },
  salary: { type: Number, required: true, min: 0 }, joinDate: { type: Date, required: true }, status: { type: String, required: true, enum: ["active", "on-leave", "exited"] },
}, { versionKey: false });
export const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
