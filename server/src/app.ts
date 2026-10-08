import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env, allowedOrigins } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const app = express();
app.use(helmet());
app.use(cors({ origin(origin, callback) { callback(null, !origin || allowedOrigins.includes(origin)); }, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api", apiLimiter, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
