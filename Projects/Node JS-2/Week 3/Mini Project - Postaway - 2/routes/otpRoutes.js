import express from "express";

import {
  generateAndSendOTP,
  validateOTP,
  updatePasswordWithOTP,
} from "../controllers/otpController.js";

const otpRouter = express.Router();

/**
 * OTP Routes
 * Handles password reset workflow using one-time passwords.
 */

// Generate and send OTP to user's email
otpRouter.post("/send", generateAndSendOTP);

// Verify OTP entered by the user
otpRouter.post("/verify", validateOTP);

// Reset password after OTP verification
otpRouter.post("/reset-password", updatePasswordWithOTP);

export default otpRouter;
