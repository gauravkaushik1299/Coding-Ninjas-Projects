import express from "express";

import {
  registerUser,
  authenticateUser,
  logoutCurrentSession,
  logoutFromAllSessions,
} from "../controllers/authController.js";

import { verifyAuthToken } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

/**
 * Authentication Routes
 * Handles user registration and login operations
 */

// Create new user account
authRouter.post("/signup", registerUser);

// User login
authRouter.post("/signin", authenticateUser);

// Logout from current device
authRouter.post("/logout", verifyAuthToken, logoutCurrentSession);

// Logout from all devices
authRouter.post("/logout-all-devices", verifyAuthToken, logoutFromAllSessions);

export default authRouter;
