import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { requireTenant } from "../middlewares/role.middleware.js";
import { listCustomers } from "../controllers/customer.controller.js";

const router = Router();

router.get("/", authUser, requireTenant, listCustomers);

export default router;