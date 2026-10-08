import multer from "multer";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const profilePhotoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (allowedImageTypes.has(file.mimetype)) callback(null, true);
    else {
      const error = new Error("Profile photo must be a JPG, PNG, or WebP image") as Error & { status: number };
      error.status = 400;
      callback(error);
    }
  },
});
