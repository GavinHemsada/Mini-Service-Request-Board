require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const {
  notFoundHandler,
  errorHandler,
  AppError,
} = require("./middleware/errors");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
function normalizeCorsOrigin(origin) {
  const value = origin.trim();

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
}

app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(",").map(normalizeCorsOrigin) }
      : { origin: true }
  )
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app, AppError };
