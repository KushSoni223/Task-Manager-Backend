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
    user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    return resetCode;
  }

  /**
   * Verify the OTP code and reset the password.
   */
  async verifyResetCodeAndUpdatePassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found.");
      return false;
    }

    console.log("Stored OTP:", user.otp, "| Received OTP:", otp);

    // Ensure OTP is stored as a string and matches the provided one
    if (String(user.otp).trim() !== String(otp).trim()) {
      console.log("Invalid OTP.");
      return false;
    }

    // Convert otpExpires to Date if needed
    const otpExpires = new Date(user.otpExpires || "");
    const now = new Date();

    console.log("OTP Expiry Time:", otpExpires, "| Current Time:", now);

    // Ensure OTP hasn't expired (valid for at least 2 minutes)
    if (now > otpExpires) {
      console.log("OTP expired.");
      return false;
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log("Password updated successfully.");
    return true;
  }
}
