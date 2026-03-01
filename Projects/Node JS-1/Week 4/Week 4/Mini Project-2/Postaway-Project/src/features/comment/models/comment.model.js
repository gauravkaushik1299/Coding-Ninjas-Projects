import { ApiError } from "../../../middleware/error.middleware.js";

let commentStore = [];
let commentIdCounter = 1;

export default class CommentRepository {
  constructor(id, userId, postId, content) {
    this.id = id;
    this.userId = userId;
    this.postId = postId;
    this.content = content;
  }

  // Create a new comment
  static create(userId, postId, content) {
    if (!postId) {
      throw new ApiError(404, "Post not found");
    }

    if (!content || content.trim() === "") {
      throw new ApiError(400, "Comment content is required");
    }

    const newComment = new CommentRepository(
      commentIdCounter++,
      userId,
      postId,
      content.trim(),
    );

    commentStore.push(newComment);
    return newComment;
  }

  // Get all comments for a post
  static findByPostId(postId) {
    if (!postId) {
      throw new ApiError(404, "Post not found");
    }

    return commentStore.filter((comment) => comment.postId === postId);
  }

  // Update comment by ID
  static updateById(commentId, content) {
    if (!commentId) {
      throw new ApiError(404, "Comment not found");
    }

    if (!content || content.trim() === "") {
      throw new ApiError(400, "Comment content is required");
    }

    const existingComment = commentStore.find(
      (comment) => comment.id === commentId,
    );

    if (!existingComment) {
      throw new ApiError(404, "Comment not found");
    }

    existingComment.content = content.trim();
    return existingComment;
  }

  // Delete comment by ID
  static deleteById(commentId) {
    if (!commentId) {
      throw new ApiError(404, "Comment not found");
    }

    const index = commentStore.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new ApiError(404, "Comment not found");
    }

    const removedComment = commentStore[index];
    commentStore.splice(index, 1);

    return removedComment;
  }
}
