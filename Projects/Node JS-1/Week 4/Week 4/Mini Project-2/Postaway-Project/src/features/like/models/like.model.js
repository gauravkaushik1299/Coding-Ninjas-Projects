import { ApiError } from "../../../middleware/error.middleware.js";

// In-memory storage for likes.
// Keeping it isolated within this module prevents accidental mutation from outside.
let likeStore = [];
let likeIdCounter = 1;

export default class LikeRepository {
  constructor(id, userId, postId) {
    this.id = id;
    this.userId = userId;
    this.postId = postId;
  }

  // Toggle like status for a post by a specific user
  static toggle(userId, postId) {
    if (!postId) {
      throw new ApiError(404, "Post not found");
    }

    // Check if the user has already liked the post
    const existingIndex = likeStore.findIndex(
      (like) => like.postId === postId && like.userId === userId,
    );

    if (existingIndex !== -1) {
      // If like exists, remove it (unlike behavior)
      likeStore.splice(existingIndex, 1);
      return { liked: false };
    }

    // If not liked yet, create a new like
    const newLike = new LikeRepository(
      likeIdCounter++, // Manual counter avoids ID duplication after deletions
      userId,
      postId,
    );

    likeStore.push(newLike);

    return { liked: true };
  }

  // Retrieve all likes for a specific post
  static findByPostId(postId) {
    if (!postId) {
      throw new ApiError(404, "Post not found");
    }

    return likeStore.filter((like) => like.postId === postId);
  }
}
