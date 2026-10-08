import { z } from "zod";
import { User } from "../models/User.js";
import { comparePassword, hashPassword, signToken } from "../services/auth.service.js";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
const registerSchema = credentialsSchema.extend({ name: z.string().trim().min(2, "Name must be at least 2 characters").max(80) });
const nameSchema = z.object({ name: z.string().trim().min(2, "Name must be at least 2 characters").max(80) });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
}).refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, { path: ["newPassword"], message: "New password must be different" });

function httpError(status, message, details) { const error = new Error(message); error.status = status; error.details = details; return error; }
function parse(schema, body) { const result = schema.safeParse(body); if (!result.success) throw httpError(400, "Please check the form fields", result.error.flatten().fieldErrors); return result.data; }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }; }

export async function register(req, res) {
  const input = parse(registerSchema, req.body);
  if (await User.exists({ email: input.email })) throw httpError(400, "An account with this email already exists");
  const user = await User.create({ name: input.name, email: input.email, passwordHash: await hashPassword(input.password) });
  res.status(201).json({ user: publicUser(user), token: signToken(user.id) });
}

export async function login(req, res) {
  const input = parse(credentialsSchema, req.body);
  const user = await User.findOne({ email: input.email }).select("+passwordHash");
  if (!user || !(await comparePassword(input.password, user.passwordHash))) throw httpError(401, "Invalid email or password");
  res.json({ user: publicUser(user), token: signToken(user.id) });
}

export async function getMe(req, res) { res.json({ user: publicUser(req.user) }); }

export async function updateMe(req, res) {
  const { name } = parse(nameSchema, req.body);
  req.user.name = name;
  await req.user.save();
  res.json({ user: publicUser(req.user) });
}

export async function updatePassword(req, res) {
  const input = parse(passwordSchema, req.body);
  const user = await User.findById(req.user.id).select("+passwordHash");
  if (!(await comparePassword(input.currentPassword, user.passwordHash))) throw httpError(401, "Current password is incorrect");
  user.passwordHash = await hashPassword(input.newPassword);
  await user.save();
  res.json({ message: "Password updated successfully" });
}
