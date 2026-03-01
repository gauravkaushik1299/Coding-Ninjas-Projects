import express from "express";
import LikeController from "../controllers/like.controller.js";

const router = express.Router();
const likeController = new LikeController();

/**
 * Toggle like status for a specific post.
 * If the user has already liked the post, it will remove the like.
 * Otherwise, it will create a new like entry.
 */
router.get("/toggle/:postId", likeController.togglePostLike);

/**
 * Retrieve all likes associated with a specific post.
 */
router.get("/:postId", likeController.fetchLikesByPost);

export default router;
