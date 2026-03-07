import express from "express";

import {
  fetchUserFriends,
  fetchPendingFriendRequests,
  toggleFriendConnection,
  respondToFriendRequest,
} from "../controllers/friendController.js";

import { verifyAuthToken } from "../middlewares/authMiddleware.js";

const friendRouter = express.Router();

/**
 * Friendship Routes
 * Handles friend connections and friend request workflows
 */

// Get all friends of a specific user
friendRouter.get("/get-friends/:userId", verifyAuthToken, fetchUserFriends);

// Retrieve pending friend requests for the logged-in user
friendRouter.get(
  "/get-pending-requests",
  verifyAuthToken,
  fetchPendingFriendRequests,
);

// Send friend request / cancel request / unfriend
friendRouter.post(
  "/toggle-friendship/:friendId",
  verifyAuthToken,
  toggleFriendConnection,
);

// Accept or reject a pending friend request
friendRouter.post(
  "/response-to-request/:friendId",
  verifyAuthToken,
  respondToFriendRequest,
);

export default friendRouter;
