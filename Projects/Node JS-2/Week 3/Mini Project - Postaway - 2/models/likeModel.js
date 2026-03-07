import mongoose from "mongoose";

/**
 * Like Schema
 * Represents a reaction from a user on either a post or a comment.
 * Only one of the fields (post or comment) should be populated.
 */
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional reference to a post
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },

    // Optional reference to a comment
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevent duplicate likes from the same user
 * on the same post or comment.
 */
likeSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
