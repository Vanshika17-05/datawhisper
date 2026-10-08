import express, { Router } from "express";
import { createExport, getExports } from "../controllers/exports.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const exportsRouter = Router();
exportsRouter.get("/", asyncHandler(getExports));
exportsRouter.post("/:queryHistoryId/:format", express.raw({ type: ["image/png", "text/csv"], limit: "10mb" }), asyncHandler(createExport));
