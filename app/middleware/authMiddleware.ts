import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface AuthRequest extends Request {
  user?: { id: string };
  refreshToken?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
