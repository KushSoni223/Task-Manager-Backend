import nodemailer from "nodemailer";
import { config } from "../config/env";

export const sendResetCode = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: config.EMAIL_USER,
    to: email,
    subject: "Your Password Reset Code",
    text: `Your password reset code is: ${code}`,
  });
};
