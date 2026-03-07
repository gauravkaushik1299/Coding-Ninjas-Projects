import mongoose from "mongoose";

/**
 * Post Schema
 * Represents posts created by users on the platform.
 * Each post can contain text content, an optional image,
 * and references to likes and comments.
 */
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: [true, "Post caption is required"],
      trim: true,
      maxlength: [1000, "Caption cannot exceed 1000 characters"],
    },

    imageUrl: {
      type: String,
      default: null,
    },

    /**
     * User who created the post
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * Users who liked the post
     */
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /**
     * Comments associated with the post
     */
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  },
);

/**
 * Index posts by creation time
 * Improves performance when sorting feed posts
 */
postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
