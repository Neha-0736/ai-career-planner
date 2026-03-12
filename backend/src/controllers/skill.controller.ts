import { Request, Response } from "express";
import prisma from "../Database/prisma";

export const createSkill = async (req: any, res: any) => {
  try {
    const { name, currentLevel, targetLevel } = req.body;

    const skill = await prisma.skill.create({
      data: {
        name,
        currentLevel,
        targetLevel,
        userId: req.userId
      }
    });

    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: "Error creating skill" });
  }
};

export const getMySkills = async (req: any, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: req.userId },
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills" });
  }
};

export const getSkillById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    res.json(skill);

  } catch (error) {
    res.status(500).json({ error: "Error fetching skill" });
  }
};


export const updateSkill = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, currentLevel, targetLevel } = req.body;

    const skill = await prisma.skill.findFirst({
      where: {
        id: id,
        userId: req.userId
      }
    });

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found or not authorized"
      });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        currentLevel,
        targetLevel
      }
    });

    res.json(updatedSkill);

  } catch (error) {
    res.status(500).json({ error: "Error updating skill" });
  }
};

export const deleteSkill = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.skill.delete({
      where: { id },
    });

    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting skill" });
  }
};

export const getSkillGap = async (req: any, res: any) => {
  try {

    console.log("User ID:", req.userId);

    const skills = await prisma.skill.findMany({
      where: {
        userId: req.userId
      }
    });

    console.log("Skills:", skills);

    if (skills.length === 0) {
      return res.status(404).json({
        message: "No skills found"
      });
    }

    const gapResult = skills.map((skill) => ({
      skillName: skill.name,
      currentLevel: skill.currentLevel,
      targetLevel: skill.targetLevel,
      gap: skill.targetLevel - skill.currentLevel
    }));

    res.json(gapResult);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error calculating gap"
    });
  }
};
