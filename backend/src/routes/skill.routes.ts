import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createSkill,
  getMySkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getSkillGap
} from "../controllers/skill.controller";

const router = express.Router();

router.post("/", authenticate, createSkill);
router.get("/", authenticate, getMySkills);
router.get("/gap", authenticate, getSkillGap);
router.get("/:id", authenticate, getSkillById);
router.put("/:id", authenticate, updateSkill);
router.delete("/:id", authenticate, deleteSkill);


export default router;