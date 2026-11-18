import { Request, Response } from "express";
import { generateCareerPlan } from "../services/ai.service";

export const getAICareerPlan = async (req: Request, res: Response) => {
  try {
    const { role, jobDescription, skills: inputSkills } = req.body;

    // Validate target role
    if (
      typeof role !== "string" ||
      !role.trim() ||
      role.trim().length > 100
    ) {
      return res.status(400).json({
        message: "Please provide a valid target job role (maximum 100 characters)"
      });
    }

    // Validate job description
    if (
      jobDescription !== undefined &&
      typeof jobDescription !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid job description"
      });
    }

    if (jobDescription && jobDescription.length > 5000) {
      return res.status(400).json({
        message: "Job description must not exceed 5000 characters"
      });
    }

    // Validate skills
    if (
      !Array.isArray(inputSkills) ||
      inputSkills.length === 0 ||
      inputSkills.length > 30
    ) {
      return res.status(400).json({
        message: "Please provide between 1 and 30 skills"
      });
    }

    const skills = inputSkills
      .map((skill: any) => {
        const name =
          typeof skill === "string"
            ? skill
            : skill?.name;

        if (typeof name !== "string") {
          return null;
        }

        const trimmedName = name.trim();

        if (!trimmedName || trimmedName.length > 50) {
          return null;
        }

        return { name: trimmedName };
      })
      .filter((skill: { name: string } | null): skill is { name: string } =>
        skill !== null
      );

    if (skills.length === 0) {
      return res.status(400).json({
        message: "Please provide valid skill names"
      });
    }

    // Generate AI career plan
    const aiPlan = await generateCareerPlan(
      role.trim(),
      jobDescription?.trim() || "",
      skills
    );

    // Calculate missing skills
    const userSkillNames = skills.map(skill =>
      skill.name.toLowerCase()
    );

    const missingSkills = aiPlan.requiredSkills.filter(
      (requiredSkill: string) =>
        !userSkillNames.includes(requiredSkill.toLowerCase().trim())
    );

    aiPlan.missingSkills = missingSkills;

    return res.status(200).json({
      role: role.trim(),
      userSkills: skills,
      aiPlan
    });

  } catch (error) {
    console.error("AI CAREER PLAN ERROR:", error);

    return res.status(502).json({
      message: "Unable to generate career plan. Please try again later."
    });
  }
};

