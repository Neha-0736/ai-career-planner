import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "User not authenticated"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    // Store the user ID where all protected controllers expect it
    req.userId = decoded.userId || decoded.id;

    if (!req.userId) {
      return res.status(401).json({
        message: "Invalid token: user ID missing"
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};