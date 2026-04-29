const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser()); // ✅ important

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});
// imports Routes
const router = require("./routes/auth.routes");

// use routes
app.use("/api/auth", router);

module.exports = app;
