import { Router } from "express";

import { getDashboardAnalytics } from "../controllers/analytics.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { requireRoles, requireTenant } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  authUser,
  requireTenant,
  requireRoles("superadmin", "admin", "agent"),
  getDashboardAnalytics,
);

export default router;
