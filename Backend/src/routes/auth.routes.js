import { Router } from "express";

import { register, verifyEmail, login, getMe,  inviteAgent, listAgents } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { registerValidator, loginValidator, inviteAgentValidator } from "../validators/auth.validator.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/register-business", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/get-me", authUser, getMe);
router.get("/verify-email", verifyEmail);

router.post("/invite-agent",authUser,requireRoles("TENANT_ADMIN"),inviteAgentValidator,inviteAgent);

router.get(
  "/agents",
  authUser,
  requireRoles("TENANT_ADMIN"),
  listAgents
);


export default router;
