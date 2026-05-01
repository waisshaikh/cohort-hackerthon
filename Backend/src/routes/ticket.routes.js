import { Router } from "express";

import {
  addMessage,
  assignTicket,
  createTicket,
  getTicket,
  listTickets,
  suggestReply,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { requireRoles, requireTenant } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authUser, requireTenant);

router.route("/").get(listTickets).post(createTicket);
router.get("/:id", getTicket);
router.patch("/:id", requireRoles("superadmin", "admin", "agent"), updateTicket);
router.patch(
  "/:id/assign",
  requireRoles("superadmin", "admin", "agent"),
  assignTicket,
);
router.post("/:id/messages", addMessage);
router.post(
  "/:id/suggest-reply",
  requireRoles("superadmin", "admin", "agent"),
  suggestReply,
);

export default router;
