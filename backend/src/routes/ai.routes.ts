
import { Router } from "express";
import { getAICareerPlan } from "../controllers/ai.controller";

const router = Router();

/*
Generate AI career plan - Public access
*/
router.post("/career-plan", getAICareerPlan);

export default router;
