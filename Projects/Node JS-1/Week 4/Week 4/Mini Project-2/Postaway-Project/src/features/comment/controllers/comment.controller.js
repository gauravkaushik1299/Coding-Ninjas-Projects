import CommentRepository from "../models/comment.model.js";

export default class CommentController {
  createComment(req, res) {
    const userId = Number(req.userId);
    const postId = Number(req.params.postId);
    const { content } = req.body;

    const newComment = CommentRepository.create(userId, postId, content);

    return res.status(201).json({
      success: true,
      comment: newComment,
    });
  }

  fetchCommentsByPost(req, res) {
    const postId = Number(req.params.postId);

    const commentList = CommentRepository.findByPostId(postId);

    return res.status(200).json({
      success: true,
      comments: commentList,
    });
  }

  editComment(req, res) {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    const modifiedComment = CommentRepository.updateById(commentId, content);

    return res.status(200).json({
      success: true,
      comment: modifiedComment,
    });
  }

  removeComment(req, res) {
    const commentId = Number(req.params.commentId);

    const removedComment = CommentRepository.deleteById(commentId);

    return res.status(200).json({
      success: true,
      comment: removedComment,
    });
  }
}
