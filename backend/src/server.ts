
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

import aiRoutes from "./routes/ai.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

// Render runs the backend behind a reverse proxy
app.set("trust proxy", 1);

// Allow the deployed frontend and local development frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

app.use(express.json({ limit: "100kb" }));

// Limit AI requests to protect OpenRouter API usage
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many career plan requests. Please try again after 15 minutes."
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Skill Gap Planner API Running"
  });
});

app.use("/api/ai", aiLimiter, aiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});