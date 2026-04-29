<<<<<<< HEAD
import express from "express";

import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
=======
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser()); // ✅ important

>>>>>>> 6ae7f9d8a3431a9b798a651f7eb76a80986738fe
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TenantDesk AI API is running",
  });
});
// imports Routes
const router = require("./routes/auth.routes");

// use routes
app.use("/api/auth", router);

app.use("/api/ai", aiRoutes);

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
