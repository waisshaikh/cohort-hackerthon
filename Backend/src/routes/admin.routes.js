import { Router } from "express";

import {
  getPlatformAnalytics,
  getTenants,
  patchTenantPlan,
  patchTenantStatus,
  removeTenant,
} from "../controllers/admin.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/platform-analytics",
  authUser,
  requireRoles("SUPER_ADMIN"),
  getPlatformAnalytics,
);

router.get(
  "/tenants",
  authUser,
  requireRoles("SUPER_ADMIN"),
  getTenants,
);

router.patch(
  "/tenants/:id/status",
  authUser,
  requireRoles("SUPER_ADMIN"),
  patchTenantStatus,
);

router.patch(
  "/tenants/:id/plan",
  authUser,
  requireRoles("SUPER_ADMIN"),
  patchTenantPlan,
);

router.delete(
  "/tenants/:id",
  authUser,
  requireRoles("SUPER_ADMIN"),
  removeTenant,
);

export default router;