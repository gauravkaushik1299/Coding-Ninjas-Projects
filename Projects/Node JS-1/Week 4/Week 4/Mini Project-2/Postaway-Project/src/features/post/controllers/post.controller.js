import PostRepository from "../models/post.model.js";

export default class PostController {
  /**
   * Create a new post for authenticated user.
   * Supports optional draft creation.
   */
  createPost(req, res) {
    const userId = Number(req.userId);
    const { caption, isDraft = false } = req.body;

    // File upload middleware may not always attach a file
    const imageUrl = req.file ? req.file.filename : null;

    const newPost = PostRepository.create(
      userId,
      caption,
      imageUrl,
      Boolean(isDraft),
    );

    return res.status(201).json({
      success: true,
      post: newPost,
    });
  }

  /**
   * Fetch all posts.
   * Supports filtering, sorting and pagination via query params.
   */
  fetchAllPosts(req, res) {
    const { search, sort, page, limit } = req.query;

    const posts = PostRepository.findAll({
      search,
      sort,
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      success: true,
      posts,
    });
  }

  /**
   * Retrieve posts created by currently logged-in user.
   */
  fetchUserPosts(req, res) {
    const userId = Number(req.userId);
    const { page, limit } = req.query;

    const userPosts = PostRepository.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      success: true,
      posts: userPosts,
    });
  }

  /**
   * Get single post by ID.
   */
  fetchPostById(req, res) {
    const postId = Number(req.params.id);

    const post = PostRepository.findById(postId);

    return res.status(200).json({
      success: true,
      post,
    });
  }

  /**
   * Update existing post.
   * Allows caption update, image replacement, draft/archive toggle.
   */
  editPost(req, res) {
    const postId = Number(req.params.id);
    const { caption, isDraft, isArchived } = req.body;

    const imageUrl = req.file ? req.file.filename : undefined;

    const updatedPost = PostRepository.updateById(postId, {
      caption,
      imageUrl,
      isDraft,
      isArchived,
    });

    return res.status(200).json({
      success: true,
      post: updatedPost,
    });
  }

  /**
   * Delete post by ID.
   */
  removePost(req, res) {
    const postId = Number(req.params.id);

    const deletedPost = PostRepository.deleteById(postId);

    return res.status(200).json({
      success: true,
      post: deletedPost,
    });
  }
}
