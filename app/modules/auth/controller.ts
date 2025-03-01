import { Request, Response, NextFunction } from "express";
import { AuthService } from "./service";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const user = await authService.signup(name, email, password);
      res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ success: true, token });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
      return;
    }

    const userId = authService.verifyRefreshToken(refreshToken);
    if (!userId) {
      res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = authService.generateAccessToken(userId);
    res.status(200).json({ success: true, accessToken: newAccessToken });
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      res.status(200).json({ success: true, message: "Token is valid" });
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
}
