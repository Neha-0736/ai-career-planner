import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import skillRoutes from "./routes/skill.routes";
import userRoutes from "./routes/user.routes";
import aiRoutes from "./routes/ai.routes";
import careerRoutes from "./routes/career.routes";

import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/career", careerRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Skill Gap Planner API Running"
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});