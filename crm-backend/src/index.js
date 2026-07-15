// src/index.js
require("dotenv").config();
const validateEnv = require("./middleware/validateEnv");
validateEnv();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const leadsRoutes = require("./routes/leads");
const customersRoutes = require("./routes/customers");
const { errorHandler } = require("./middleware/errorHandler");
const corsOptions = require("../config/corsOptions");
// swagger
const swaggerUi = require("swagger-ui-express");
const merged = require("./swagger");
// Run migrations on startup
require("./db/migrate");

const app = express();
const PORT = process.env.PORT;

// ── Global middleware ──────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 20,
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
  }),
);

// ── Routes ─────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/customers", customersRoutes);
//swagger configuration and setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(merged));
// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);

// Error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`\n CRM Dashboard API running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
