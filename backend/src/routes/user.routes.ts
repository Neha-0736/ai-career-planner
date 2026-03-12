import express from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/me", authenticate, (req: any, res) => {
  res.json({
    message: "Protected route working",
    userId: req.userId,
  });
});

export default router;