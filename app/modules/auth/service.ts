import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/env";
import { AuthRepository } from "./repository";
import { User } from "./model";

const authRepo = new AuthRepository();

export class AuthService {
  async signup(name: string, email: string, password: string) {
    const existingUser = await authRepo.findByEmail(email);
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    return await authRepo.createUser({ name, email, password: hashedPassword });
  }

  async login(email: string, password: string) {
    const user = await authRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const hashedPassword: string = user.password || "";
    if (!hashedPassword) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) throw new Error("Invalid credentials");

    return jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  }

  verifyRefreshToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET) as {
        userId: string;
      };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }

  async generatePasswordResetCode(email: string): Promise<string | null> {
    const user = await User.findOne({ email });

    if (!user) return null;

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = resetCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return resetCode;
  }

  /**
   * Verify the OTP code and reset the password.
   */
  async verifyResetCodeAndUpdatePassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findOne({ email });
    console.log("sjabfjdsbaj", user);

    if (!user || user.otp !== code) return false;

    if (user.otpExpires && user.otpExpires < new Date()) {
      return false;
    }

    const salt = await bcrypt.genSalt(10);
    console.log("ksanfsdafnsbafd", salt);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return true;
  }
}
