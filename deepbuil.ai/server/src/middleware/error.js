export function notFound(_req, res, _next) {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  console.error("🔥", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.publicMessage || err.message || "Server error",
  });
}
