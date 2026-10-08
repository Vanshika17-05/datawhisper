export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 11000) return res.status(400).json({ error: "An account with this email already exists" });
  if (!error.status) console.error(error);
  res.status(error.status ?? 500).json({
    error: error.status ? error.message : "Internal server error",
    ...(error.details ? { details: error.details } : {}),
  });
}
