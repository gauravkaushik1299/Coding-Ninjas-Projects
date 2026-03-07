import express from "express";

import {
  createUserAccount,
  authenticateUserAccount,
  logoutCurrentUser,
  logoutFromAllSessions,
  fetchUserProfile,
  fetchAllUsers,
  modifyUserProfile,
  updateUserAvatar,
} from "../controllers/userController.js";

import { verifyAuthToken } from "../middlewares/authMiddleware.js";
import { uploadAvatarImage } from "../middlewares/avatarUpload.js";

const userRouter = express.Router();

/**
 * User Routes
 * Handles authentication and profile management operations
 */

// Register new user
userRouter.post("/signup", createUserAccount);

// Login user
userRouter.post("/signin", authenticateUserAccount);

// Logout current session
userRouter.post("/logout", verifyAuthToken, logoutCurrentUser);

// Logout from all devices
userRouter.post("/logout-all-devices", verifyAuthToken, logoutFromAllSessions);

// Get user profile details
userRouter.get("/get-details/:userId", verifyAuthToken, fetchUserProfile);

// Retrieve all users
userRouter.get("/get-all-details", verifyAuthToken, fetchAllUsers);

// Update user profile information
userRouter.put("/update-details/:userId", verifyAuthToken, modifyUserProfile);

// Upload / update user avatar
userRouter.put(
  "/update-avatar/:userId",
  verifyAuthToken,
  uploadAvatarImage.single("avatar"),
  updateUserAvatar,
);

export default userRouter;
