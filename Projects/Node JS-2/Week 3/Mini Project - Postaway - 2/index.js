import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import friendRouter from "./routes/friendRoutes.js";
import otpRouter from "./routes/otpRoutes.js";

import globalErrorHandler from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Database connection
 */
connectDB();

/**
 * API Routes
 */
app.use("/api/users", authRouter);
app.use("/api/users", userRouter);

app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/friends", friendRouter);
app.use("/api/otp", otpRouter);

/**
 * Health check route
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Social Media API is running",
  });
});

/**
 * Global error handler
 */
app.use(globalErrorHandler);

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
