import { Router } from "express";

import { analyzeTicketController } from "../controllers/ai.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/analyze-ticket", authUser, analyzeTicketController);

export default router;
