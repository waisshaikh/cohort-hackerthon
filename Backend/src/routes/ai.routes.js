import { Router } from "express";

import { analyzeTicketController } from "../controllers/ai.controller.js";

const router = Router();

router.post("/analyze-ticket", analyzeTicketController);

export default router;
