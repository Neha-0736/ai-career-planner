import { Request, Response } from "express";
import { prisma } from "../Database/prisma";
import { generateCareerPlan } from "../services/ai.service";

export const getAICareerPlan = async (req: any, res: Response) => {

  try {

    const { role, jobDescription } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    // Get user skills from DB
    const skills = await prisma.skill.findMany({
      where: {
        userId: userId
      }
    });

    if (skills.length === 0) {
      return res.status(400).json({
        message: "Add skills before generating AI plan"
      });
    }

    // Call AI service
    const aiPlan = await generateCareerPlan(
      role,
      jobDescription,
      skills
    );

    // Get user skill names
const userSkillNames = skills.map((s: any) =>
  s.name.toLowerCase()
);

// Calculate missing skills
const missingSkills = aiPlan.requiredSkills.filter((reqSkill: string) => {

  const req = reqSkill.toLowerCase();

  return !userSkillNames.some((userSkill) =>
    req.includes(userSkill)
  );

});

// update aiPlan
aiPlan.missingSkills = missingSkills;

    res.json({
      role,
      userSkills: skills,
      aiPlan
    });

  } catch (error: any) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};