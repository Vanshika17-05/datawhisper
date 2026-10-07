export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error);
  res.status(error.status ?? 500).json({
    error: error.status ? error.message : "Internal server error",
  });
}
