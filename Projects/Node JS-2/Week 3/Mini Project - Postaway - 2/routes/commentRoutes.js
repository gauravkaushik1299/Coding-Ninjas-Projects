import express from "express";

import {
  createPostComment,
  fetchCommentsForPost,
  editExistingComment,
  removeComment,
} from "../controllers/commentController.js";

import { verifyAuthToken } from "../middlewares/authMiddleware.js";

const commentRouter = express.Router();

/**
 * Comment Routes
 * Handles operations related to comments on posts
 */

// Create a comment for a specific post
commentRouter.post("/:postId", verifyAuthToken, createPostComment);

// Retrieve comments for a post
commentRouter.get("/:postId", verifyAuthToken, fetchCommentsForPost);

// Update a specific comment
commentRouter.put("/:commentId", verifyAuthToken, editExistingComment);

// Delete a comment
commentRouter.delete("/:commentId", verifyAuthToken, removeComment);

export default commentRouter;
