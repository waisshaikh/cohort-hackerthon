const express = require("express");
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  getMe,
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

const { authUser } = require("../middlewares/auth.middleware");

/**
 * @route POST /api/auth/register
 */
router.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 */
router.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/get-me
 */
router.get("/get-me", authUser, getMe);

/**
 * @route GET /api/auth/verify-email
 */
router.get("/verify-email", verifyEmail);

module.exports = router;
