import { Router } from "express";

import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/get-me", authUser, getMe);
router.get("/verify-email", verifyEmail);

export default router;
