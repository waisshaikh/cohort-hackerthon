import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import Tenant from "./models/tenant.model.js";

import analyticsRoutes from "./routes/analytics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import integrationRoutes from "./routes/integration.routes.js";

const app = express();

app.use(
  cors({
    origin: async (origin, callback) => {
      try {
        // Allow Postman / server-to-server / same-origin requests
        if (!origin) return callback(null, true);

        // Local dev
        const localOrigins = [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://localhost:5174",
          "http://127.0.0.1:5174",
          "https://tablioone.com"
        ];

        if (localOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Allow backend/widget host
        if (origin === "https://cohort-hackerthon.onrender.com") {
          return callback(null, true);
        }

        const cleanDomain = origin
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "");

        const tenant = await Tenant.findOne({
          "websiteIntegration.domain": cleanDomain,
          "websiteIntegration.isVerified": true,
        });

        if (tenant) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      } catch (err) {
        return callback(err);
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
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
app.use("/api/customers", customerRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/integrations", integrationRoutes);

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