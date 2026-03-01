import express from "express";
import CommentController from "../controllers/comment.controller.js";

const router = express.Router();
const commentController = new CommentController();

// Create comment for a post
router.post("/:postId", commentController.createComment);

// Get all comments for a post
router.get("/:postId", commentController.fetchCommentsByPost);

// Update comment by ID
router.put("/:commentId", commentController.editComment);

// Delete comment by ID
router.delete("/:commentId", commentController.removeComment);

export default router;
