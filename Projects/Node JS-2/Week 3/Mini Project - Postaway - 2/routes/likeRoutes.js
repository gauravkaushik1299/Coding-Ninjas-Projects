import express from "express";

import {
  toggleReaction,
  fetchLikesForTarget,
} from "../controllers/likeController.js";

import { verifyAuthToken } from "../middlewares/authMiddleware.js";

const likeRouter = express.Router();

/**
 * Like / Reaction Routes
 * Supports likes on both posts and comments
 */

// Toggle like on a post or comment
likeRouter.post("/toggle/:id", verifyAuthToken, toggleReaction);

// Retrieve likes for a post or comment
likeRouter.get("/:id", verifyAuthToken, fetchLikesForTarget);

export default likeRouter;
