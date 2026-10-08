import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { analyticsSummary } from "./analytics.controller.js";

export const analyticsRouter = Router();
analyticsRouter.get("/summary", asyncHandler(analyticsSummary));
