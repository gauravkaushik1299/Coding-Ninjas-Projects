import Post from "../models/postModel.js";
import User from "../models/userModel.js";

/**
 * Publish a new post to the platform.
 * The authenticated user becomes the owner of the post.
 */
export const publishPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;

    if (!caption || caption.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post caption is required",
      });
    }

    const createdPost = await Post.create({
      caption: caption.trim(),
      imageUrl: imageUrl || null,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: createdPost,
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create post",
    });
  }
};

/**
 * Retrieve posts for the main feed.
 * Includes user info, likes and comment population.
 */
export const fetchFeedPosts = async (req, res) => {
  try {
    const feedPosts = await Post.find()
      .populate("createdBy", "name email")
      .populate("likes", "name email")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalPosts: feedPosts.length,
      posts: feedPosts,
    });
  } catch (error) {
    console.error("Fetch posts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

/**
 * Retrieve a single post by ID
 */
export const fetchPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;

    const postRecord = await Post.findById(postId)
      .populate("createdBy", "name email")
      .populate("likes", "name email")
      .populate({
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
      post: postRecord,
    });
  } catch (error) {
    console.error("Fetch single post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve post",
    });
  }
};

/**
 * Update an existing post.
 * Only the owner of the post can modify it.
 */
export const modifyPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption, imageUrl } = req.body;

    const postRecord = await Post.findById(postId);

    if (!postRecord) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (postRecord.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post",
      });
    }

    if (caption) postRecord.caption = caption.trim();
    if (imageUrl) postRecord.imageUrl = imageUrl;

    await postRecord.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: postRecord,
    });
  } catch (error) {
    console.error("Update post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Post update failed",
    });
  }
};

/**
 * Delete a post.
 * Only the original creator can remove it.
 */
export const removePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postRecord = await Post.findById(postId);

    if (!postRecord) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (postRecord.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await postRecord.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

/**
 * Retrieve all posts created by a specific user.
 */
export const fetchUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRecord = await User.findById(userId);

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userPosts = await Post.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .populate("likes", "name email")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalPosts: userPosts.length,
      posts: userPosts,
    });
  } catch (error) {
    console.error("Fetch user posts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user's posts",
    });
  }
};
