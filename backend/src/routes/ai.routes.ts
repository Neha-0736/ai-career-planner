import { Router } from "express";
import { getAICareerPlan } from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/*
Generate AI career plan
*/
router.post("/career-plan",authenticate, getAICareerPlan);

export default router;