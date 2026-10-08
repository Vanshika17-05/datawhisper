import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  const details = result.error.issues.map(({ path, message }) => `${path.join(".")}: ${message}`).join("\n");
  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = result.data;
export const allowedOrigins = env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean);
