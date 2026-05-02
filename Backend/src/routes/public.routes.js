import { Router } from "express";
import { createPublicTicket } from "../controllers/ticket.controller.js";

const router = Router();

router.post("/:tenantSlug/ticket", createPublicTicket);

export default router;