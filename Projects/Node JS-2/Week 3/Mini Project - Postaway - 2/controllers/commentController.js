import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";

/**
 * Create a new comment for a specific post
 */
export const createPostComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text cannot be empty",
      });
    }

    // Ensure the post exists before attaching comment
    const targetPost = await Post.findOne({ _id: postId });

    if (!targetPost) {
      return res.status(404).json({
        success: false,
        message: "Target post does not exist",
      });
    }

    const newComment = await Comment.create({
      text: text.trim(),
      post: postId,
      createdBy: req.user._id,
    });

    // Store comment reference inside post document
    targetPost.comments.push(newComment._id);
    await targetPost.save();

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Comment creation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create comment",
    });
  }
};

/**
 * Retrieve all comments belonging to a post
 */
export const fetchCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postRecord = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    });

    if (!postRecord) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: postRecord.comments.length,
      comments: postRecord.comments,
    });
  } catch (error) {
    console.error("Fetch comments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comments",
    });
  }
};

/**
 * Modify an existing comment
 * Allowed for comment owner OR post owner
 */
export const editExistingComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Updated comment text is required",
      });
    }

    const commentRecord = await Comment.findById(commentId);

    if (!commentRecord) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const parentPost = await Post.findById(commentRecord.post);

    const isCommentOwner =
      commentRecord.createdBy.toString() === req.user._id.toString();

    const isPostOwner =
      parentPost?.createdBy?.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this comment",
      });
    }

    commentRecord.text = text.trim();
    await commentRecord.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: commentRecord,
    });
  } catch (error) {
    console.error("Update comment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Comment update failed",
    });
  }
};

/**
 * Remove a comment
 * Allowed for comment owner OR post owner
 */
export const removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const commentRecord = await Comment.findById(commentId);

    if (!commentRecord) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const parentPost = await Post.findById(commentRecord.post);

    const isCommentOwner =
      commentRecord.createdBy.toString() === req.user._id.toString();

    const isPostOwner =
      parentPost?.createdBy?.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this comment",
      });
    }

    // Remove comment reference from post document
    await Post.updateOne(
      { _id: commentRecord.post },
      { $pull: { comments: commentRecord._id } },
    );

    await commentRecord.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment removed successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};
