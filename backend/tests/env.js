const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-router-tests";
process.env.JWT_EXPIRES_IN = "1h";
