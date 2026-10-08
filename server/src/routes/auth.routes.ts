import { Router } from "express";
import { deleteMyPhoto, getMe, login, register, updateMe, updatePassword, uploadMyPhoto } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { profilePhotoUpload } from "../middleware/profilePhoto.middleware.js";

export const authRouter = Router();
authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", requireAuth, asyncHandler(getMe));
authRouter.put("/me", requireAuth, asyncHandler(updateMe));
authRouter.put("/password", requireAuth, asyncHandler(updatePassword));
authRouter.post("/me/photo", requireAuth, profilePhotoUpload.single("photo"), asyncHandler(uploadMyPhoto));
authRouter.delete("/me/photo", requireAuth, asyncHandler(deleteMyPhoto));
