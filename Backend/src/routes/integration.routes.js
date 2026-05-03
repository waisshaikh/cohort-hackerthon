import { Router } from "express";

import {
  setupDnsIntegration,
  verifyDnsIntegration,
  setupCmsIntegration,
  getIntegrationStatus,
} from "../controllers/integration.controller.js";

import { authUser } from "../middlewares/auth.middleware.js";
import { requireTenant } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authUser, requireTenant);

router.get("/status", getIntegrationStatus);

router.post("/dns/setup", setupDnsIntegration);
router.post("/dns/verify", verifyDnsIntegration);

router.post("/cms/setup", setupCmsIntegration);

export default router;