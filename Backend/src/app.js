import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import analyticsRoutes from "./routes/analytics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TenantDesk AI API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled application error:", error);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;
