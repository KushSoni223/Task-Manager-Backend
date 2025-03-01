import express from "express";
import { AuthController } from "./controller";

const router = express.Router();
const authController = new AuthController();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get("/verify-token", authController.validateToken);

export default router;
