import { z } from "zod";
import { User } from "../models/User.js";
import { comparePassword, hashPassword, signToken } from "../services/auth.service.js";
import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import type { UserDocument } from "../types/domain.js";
import { deleteProfilePhoto, getProfilePhotoUrl, uploadProfilePhoto } from "../services/s3.service.js";

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

interface HttpError extends Error { status: number; details?: unknown }
function httpError(status: number, message: string, details?: unknown): HttpError { const error = new Error(message) as HttpError; error.status = status; error.details = details; return error; }
function parse<T>(schema: z.ZodType<T>, body: unknown): T { const result = schema.safeParse(body); if (!result.success) throw httpError(400, "Please check the form fields", z.flattenError(result.error).fieldErrors); return result.data; }
async function publicUser(user: HydratedDocument<UserDocument>) {
  const profilePhotoUrl = user.profilePhotoUrl ? await getProfilePhotoUrl(user.profilePhotoUrl) : null;
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, profilePhotoUrl };
}

export async function register(req: Request, res: Response): Promise<void> {
  const input = parse(registerSchema, req.body);
  if (await User.exists({ email: input.email })) throw httpError(400, "An account with this email already exists");
  const user = await User.create({ name: input.name, email: input.email, passwordHash: await hashPassword(input.password) });
  res.status(201).json({ user: await publicUser(user), token: signToken(user.id) });
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = parse(credentialsSchema, req.body);
  const user = await User.findOne({ email: input.email }).select("+passwordHash");
  if (!user || !(await comparePassword(input.password, user.passwordHash))) throw httpError(401, "Invalid email or password");
  res.json({ user: await publicUser(user), token: signToken(user.id) });
}

export async function getMe(req: Request, res: Response): Promise<void> { res.json({ user: await publicUser(req.user) }); }

export async function updateMe(req: Request, res: Response): Promise<void> {
  const { name } = parse(nameSchema, req.body);
  req.user.name = name;
  await req.user.save();
  res.json({ user: await publicUser(req.user) });
}

function detectImage(file: Express.Multer.File): { extension: string; contentType: string } | null {
  const bytes = file.buffer;
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { extension: "png", contentType: "image/png" };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { extension: "jpg", contentType: "image/jpeg" };
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return { extension: "webp", contentType: "image/webp" };
  return null;
}

export async function uploadMyPhoto(req: Request, res: Response): Promise<void> {
  if (!req.file) throw httpError(400, "Choose a JPG, PNG, or WebP image to upload");
  const image = detectImage(req.file);
  if (!image) throw httpError(400, "The selected file is not a valid JPG, PNG, or WebP image");
  const previousKey = req.user.profilePhotoUrl;
  let key: string;
  try { key = await uploadProfilePhoto(req.user.id, image.extension, image.contentType, req.file.buffer); }
  catch (error) { console.error("Profile photo upload failed:", error instanceof Error ? error.message : error); throw httpError(502, "Profile photo storage is temporarily unavailable"); }
  req.user.profilePhotoUrl = key;
  await req.user.save();
  if (previousKey && previousKey !== key) await deleteProfilePhoto(previousKey).catch((error) => console.error("Old profile photo cleanup failed:", error instanceof Error ? error.message : error));
  res.json({ user: await publicUser(req.user) });
}

export async function deleteMyPhoto(req: Request, res: Response): Promise<void> {
  const key = req.user.profilePhotoUrl;
  if (key) {
    try { await deleteProfilePhoto(key); }
    catch (error) { console.error("Profile photo deletion failed:", error instanceof Error ? error.message : error); throw httpError(502, "Profile photo storage is temporarily unavailable"); }
  }
  req.user.profilePhotoUrl = undefined;
  await req.user.save();
  res.json({ user: await publicUser(req.user) });
}

export async function updatePassword(req: Request, res: Response): Promise<void> {
  const input = parse(passwordSchema, req.body);
  const user = await User.findById(req.user.id).select("+passwordHash");
  if (!user) throw httpError(404, "Account not found");
  if (!(await comparePassword(input.currentPassword, user.passwordHash))) throw httpError(401, "Current password is incorrect");
  user.passwordHash = await hashPassword(input.newPassword);
  await user.save();
  res.json({ message: "Password updated successfully" });
}
