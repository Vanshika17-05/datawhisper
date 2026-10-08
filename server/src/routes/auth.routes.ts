import { Router } from "express";
import { getMe, login, register, updateMe, updatePassword } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const authRouter = Router();
authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", requireAuth, asyncHandler(getMe));
authRouter.put("/me", requireAuth, asyncHandler(updateMe));
authRouter.put("/password", requireAuth, asyncHandler(updatePassword));
