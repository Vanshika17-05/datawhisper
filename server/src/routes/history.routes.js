import { Router } from "express";
import { getQueryHistory } from "../controllers/history.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const historyRouter = Router();
historyRouter.get("/", asyncHandler(getQueryHistory));
