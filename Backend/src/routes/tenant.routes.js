import { Router } from "express";

import {
  addMember,
  getWorkspace,
  updateWorkspace,
} from "../controllers/tenant.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { requireRoles, requireTenant } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authUser, requireTenant);

router.get("/workspace", getWorkspace);
router.patch("/workspace", requireRoles("SUPER_ADMIN", "TENANT_ADMIN"), updateWorkspace);
router.post("/members", requireRoles("SUPER_ADMIN", "TENANT_ADMIN"), addMember);

export default router;
