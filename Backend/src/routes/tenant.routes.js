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
router.patch("/workspace", requireRoles("superadmin", "admin"), updateWorkspace);
router.post("/members", requireRoles("superadmin", "admin"), addMember);

export default router;
