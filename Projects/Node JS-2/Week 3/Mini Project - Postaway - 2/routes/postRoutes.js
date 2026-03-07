import express from "express";

import {
  publishNewPost,
  fetchFeedPosts,
  fetchSinglePost,
  modifyExistingPost,
  removePost,
  fetchPostsByUser,
} from "../controllers/postController.js";

import { verifyAuthToken } from "../middlewares/authMiddleware.js";

const postRouter = express.Router();

/**
 * Post Routes
 * Handles creation, retrieval, updating, and deletion of posts.
 */

// Create a new post
postRouter.post("/", verifyAuthToken, publishNewPost);

// Retrieve news feed posts
postRouter.get("/all", verifyAuthToken, fetchFeedPosts);

// Retrieve a single post
postRouter.get("/:postId", verifyAuthToken, fetchSinglePost);

// Update a post
postRouter.put("/:postId", verifyAuthToken, modifyExistingPost);

// Delete a post
postRouter.delete("/:postId", verifyAuthToken, removePost);

// Retrieve posts created by a specific user
postRouter.get("/user/:userId", verifyAuthToken, fetchPostsByUser);

export default postRouter;
