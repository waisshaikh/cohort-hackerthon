import { Router } from "express";
import { createPublicTicket } from "../controllers/ticket.controller.js";
import { getWidgetConfig, serveWidgetScript, serveWidgetIframe } from "../controllers/widget.controller.js";

const router = Router();

// Widget endpoints
router.get("/widget/config", getWidgetConfig);
router.get("/widget.js", serveWidgetScript);
router.get("/widget-iframe.html", serveWidgetIframe);

// Ticket endpoints
router.post("/:tenantSlug/ticket", createPublicTicket);

export default router;