import { Router } from "express";
import { getCollectionData } from "../controllers/data.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const dataRouter = Router();
dataRouter.get("/:collection", asyncHandler(getCollectionData));
