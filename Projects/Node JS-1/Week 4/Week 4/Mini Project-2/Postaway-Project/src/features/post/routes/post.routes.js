import express from "express";
import PostController from "../controllers/post.controller.js";
import upload from "../../../middleware/multer.middleware.js";

const router = express.Router();
const postController = new PostController();

/**
 * Create a new post.
 * Supports image upload and optional draft creation.
 */
router.post("/", upload.single("imageUrl"), postController.createPost);

/**
 * Retrieve all posts.
 * Supports search, sorting and pagination via query params.
 */
router.get("/all", postController.fetchAllPosts);

/**
 * Retrieve posts created by the authenticated user.
 */
router.get("/", postController.fetchUserPosts);

/**
 * Retrieve a single post by ID.
 */
router.get("/:id", postController.fetchPostById);

/**
 * Update post by ID.
 * Allows caption update, image replacement, draft/archive toggling.
 */
router.put("/:id", upload.single("imageUrl"), postController.editPost);

/**
 * Delete post by ID.
 */
router.delete("/:id", postController.removePost);

export default router;
