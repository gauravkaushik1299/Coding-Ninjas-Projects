import crypto from "crypto";
import OTP from "../models/otpModel.js";
import { sendOtpEmail } from "./emailUtils.js";

/**
 * Generate a secure 6-digit OTP
 */
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP before storing it in the database
 */
const hashOtpCode = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Create OTP entry and send email
 */
const issuePasswordResetOtp = async (email) => {
  try {
    const otpCode = generateOtpCode();
    const hashedOtp = hashOtpCode(otpCode);

    // Store hashed OTP in database
    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Send OTP email using centralized email utility
    await sendOtpEmail(email, otpCode);

    console.log(`[OTP Service] OTP dispatched to ${email}`);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("[OTP Service Error]:", error.message);

    throw new Error("Unable to send OTP at the moment");
  }
};

export default issuePasswordResetOtp;
