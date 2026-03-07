import mongoose from "mongoose";

/**
 * Comment Schema
 * Represents comments created by users on posts.
 * Each comment stores its author and the post it belongs to.
 */
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    // Reference to the related post
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // User who created the comment
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * Users who liked this comment
     * Used by the likeController for toggle reactions
     */
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

/**
 * Export Comment model
 */
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
