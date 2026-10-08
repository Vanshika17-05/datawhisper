import { Router } from "express";
import { getQueryHistory, getSimilarQuestions } from "../controllers/history.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const historyRouter = Router();
historyRouter.get("/", asyncHandler(getQueryHistory));
historyRouter.post("/similar", asyncHandler(getSimilarQuestions));
