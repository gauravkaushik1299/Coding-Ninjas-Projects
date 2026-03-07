import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";

/**
 * Mail transporter used for sending OTP emails.
 * Using Gmail service here but can be swapped with other providers easily.
 */
const mailTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Generate and send a password reset OTP
 */
export const generateAndSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userRecord = await User.findOne({ email });

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "No account associated with this email",
      });
    }

    // Generate secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999);

    // Store OTP entry in DB with expiry
    const otpRecord = new OTP({
      email,
      otp: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    });

    await otpRecord.save();

    const emailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your password reset OTP is ${otpCode}. This code will expire in 10 minutes.`,
    };

    await mailTransporter.sendMail(emailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
    });
  }
};

/**
 * Validate OTP provided by the user
 */
export const validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP provided",
      });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/**
 * Reset user password after OTP verification
 */
export const updatePasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const userRecord = await User.findOne({ email });

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    /**
     * Password hashing is expected to happen in the User schema
     * via a pre-save middleware.
     */
    userRecord.password = newPassword;

    await userRecord.save();

    // Remove OTP entry after successful reset
    await OTP.deleteOne({ email, otp });

    return res.status(200).json({
      success: true,
      message: "Password reset completed successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Password reset process failed",
    });
  }
};
