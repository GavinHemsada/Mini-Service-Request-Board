class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: "Not found",
    message: `No route matches ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || (err.name === "CastError" ? 400 : 500);
  const body = {
    error: err.message || "Internal server error",
  };
  if (process.env.NODE_ENV !== "production" && status === 500) {
    body.stack = err.stack;
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate value", fields: err.keyValue });
  }
  res.status(status).json(body);
}

module.exports = { AppError, notFoundHandler, errorHandler };
