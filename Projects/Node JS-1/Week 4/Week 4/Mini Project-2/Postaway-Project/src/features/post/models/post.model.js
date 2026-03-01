import { ApiError } from "../../../middleware/error.middleware.js";

// In-memory storage for posts.
// Keeping state scoped to this module ensures predictable behavior.
let postStore = [];
let postIdCounter = 1;

export default class PostRepository {
  constructor(id, userId, caption, imageUrl, isDraft = false) {
    this.id = id;
    this.userId = userId;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.isDraft = isDraft;
    this.isArchived = false;
    this.createdAt = new Date();
  }

  /**
   * Create a new post.
   * Draft posts are allowed without image.
   */
  static create(userId, caption, imageUrl, isDraft = false) {
    if (!caption || caption.trim() === "") {
      throw new ApiError(400, "Caption is required");
    }

    if (!isDraft && !imageUrl) {
      throw new ApiError(400, "Image is required for published posts");
    }

    const newPost = new PostRepository(
      postIdCounter++, // manual counter prevents ID collision after deletions
      userId,
      caption.trim(),
      imageUrl || null,
      isDraft,
    );

    postStore.push(newPost);
    return newPost;
  }

  /**
   * Retrieve all posts with optional:
   * - search (caption filtering)
   * - sort (latest | oldest)
   * - pagination (page & limit)
   */
  static findAll({ search, sort, page = 1, limit = 10 } = {}) {
    let results = [...postStore];

    // Exclude archived posts by default
    results = results.filter((post) => !post.isArchived);

    // Caption search
    if (search) {
      const keyword = search.toLowerCase();
      results = results.filter((post) =>
        post.caption.toLowerCase().includes(keyword),
      );
    }

    // Sorting
    if (sort === "latest") {
      results.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === "oldest") {
      results.sort((a, b) => a.createdAt - b.createdAt);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;

    return results.slice(start, end);
  }

  /**
   * Get posts created by specific user.
   */
  static findByUser(userId, { page = 1, limit = 10 } = {}) {
    let results = postStore.filter(
      (post) => post.userId === userId && !post.isArchived,
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return results.slice(start, end);
  }

  /**
   * Retrieve single post by ID.
   */
  static findById(postId) {
    const post = postStore.find((post) => post.id === postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    return post;
  }

  /**
   * Update post fields.
   * Supports caption update, image replacement, draft toggle, archive toggle.
   */
  static updateById(postId, updates = {}) {
    const post = this.findById(postId);

    const { caption, imageUrl, isDraft, isArchived } = updates;

    if (caption !== undefined) {
      if (!caption.trim()) {
        throw new ApiError(400, "Caption cannot be empty");
      }
      post.caption = caption.trim();
    }

    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }

    if (typeof isDraft === "boolean") {
      post.isDraft = isDraft;
    }

    if (typeof isArchived === "boolean") {
      post.isArchived = isArchived;
    }

    return post;
  }

  /**
   * Delete post by ID.
   */
  static deleteById(postId) {
    const index = postStore.findIndex((post) => post.id === postId);

    if (index === -1) {
      throw new ApiError(404, "Post not found");
    }

    const removedPost = postStore[index];
    postStore.splice(index, 1);

    return removedPost;
  }
}
