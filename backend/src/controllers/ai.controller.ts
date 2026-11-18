
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
          typeof skill === "string" ? skill : skill?.name;

        if (typeof name !== "string") {
          return null;
        }

        const trimmedName = name.trim();

        if (!trimmedName || trimmedName.length > 50) {
          return null;
        }

        return { name: trimmedName };
      })
      .filter(
        (skill: { name: string } | null): skill is { name: string } =>
          skill !== null
      );

    if (skills.length === 0) {
      return res.status(400).json({
        message: "Please provide valid skill names"
      });
    }

    // Remove duplicate user skills, ignoring capitalization
    const uniqueSkills = Array.from(
      new Map(
        skills.map(skill => [skill.name.toLowerCase(), skill])
      ).values()
    );

    // Generate AI career plan
    const aiPlan = await generateCareerPlan(
      role.trim(),
      jobDescription?.trim() || "",
      uniqueSkills
    );

    // Normalize required skills and preserve all existing user skills
    const requiredSkills = Array.isArray(aiPlan.requiredSkills)
      ? aiPlan.requiredSkills
      : [];

    const requiredSkillMap = new Map<string, string>();

    requiredSkills.forEach((skill: string) => {
      if (typeof skill === "string" && skill.trim()) {
        requiredSkillMap.set(skill.trim().toLowerCase(), skill.trim());
      }
    });

    // Add user skills that AI did not include
    uniqueSkills.forEach(skill => {
      const key = skill.name.toLowerCase();

      if (!requiredSkillMap.has(key)) {
        requiredSkillMap.set(key, skill.name);
      }
    });

    // Final required skills list
    aiPlan.requiredSkills = Array.from(requiredSkillMap.values());

    // Calculate missing skills using case-insensitive comparison
    const userSkillNames = new Set(
      uniqueSkills.map(skill => skill.name.toLowerCase())
    );

    aiPlan.missingSkills = aiPlan.requiredSkills.filter(
      (skill: string) => !userSkillNames.has(skill.toLowerCase().trim())
    );

    return res.status(200).json({
      role: role.trim(),
      userSkills: uniqueSkills,
      aiPlan
    });

  } catch (error) {
    console.error("AI CAREER PLAN ERROR:", error);

    return res.status(502).json({
      message: "Unable to generate career plan. Please try again later."
    });
  }
};
