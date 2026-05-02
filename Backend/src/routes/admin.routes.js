import { Router } from "express";

import { getPlatformAnalytics } from "../controllers/admin.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/platform-analytics",
  authUser,
  requireRoles("SUPER_ADMIN"),
  getPlatformAnalytics
);

export default router;