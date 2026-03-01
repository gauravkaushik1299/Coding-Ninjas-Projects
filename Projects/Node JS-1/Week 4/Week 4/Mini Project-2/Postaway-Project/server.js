import express from "express";
import cors from "cors";

import userRouter from "./src/features/user/routes/user.routes.js";
import postRouter from "./src/features/post/routes/post.routes.js";
import commentRouter from "./src/features/comment/routes/comment.routes.js";
import likeRouter from "./src/features/like/routes/like.routes.js";

import jwtAuth from "./src/middleware/jwtAuth.middleware.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import { errorHandlerMiddleware } from "./src/middleware/error.middleware.js";
import { invalidRouteHandlerMiddleware } from "./src/middleware/invalidRoute.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Core middlewares
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static("public/uploads"));

// Log all incoming requests (excluding user routes handled inside middleware)
app.use(loggerMiddleware);

/**
 * Route registrations
 * User routes remain public.
 * All other routes are protected via JWT middleware.
 */
app.use("/api/v1/users", userRouter);

app.use("/api/v1/posts", jwtAuth, postRouter);
app.use("/api/v1/comments", jwtAuth, commentRouter);
app.use("/api/v1/likes", jwtAuth, likeRouter);

/**
 * Handle invalid routes
 */
app.use(invalidRouteHandlerMiddleware);

/**
 * Global error handler (must be last)
 */
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
