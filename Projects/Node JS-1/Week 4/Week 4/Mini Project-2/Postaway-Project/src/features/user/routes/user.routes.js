// third-party imports
import express from "express";

// local imports
import UserController from "../controllers/user.controller.js";

// initialize router
const router = express.Router();
const userController = new UserController();

/**
 * Retrieve all users.
 * Can be restricted to admin usage in future if roles are introduced.
 */
router.get("/", userController.fetchAllUsers);

/**
 * Register a new user account.
 */
router.post("/signup", userController.registerUser);

/**
 * Authenticate user and return JWT token.
 */
router.post("/signin", userController.loginUser);

export default router;
