require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const { notFoundHandler, errorHandler, AppError } = require("./middleware/errors");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(",").map((s) => s.trim()) }
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
