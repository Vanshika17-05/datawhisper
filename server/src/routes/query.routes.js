import { Router } from "express";
import { runQuery } from "../controllers/query.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { queryLimiter } from "../middleware/rateLimiter.js";

export const queryRouter = Router();
queryRouter.post("/", queryLimiter, asyncHandler(runQuery));
