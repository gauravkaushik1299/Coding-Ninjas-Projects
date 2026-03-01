import LikeRepository from "../models/like.model.js";

export default class LikeController {
  togglePostLike(req, res) {
    const userId = Number(req.userId);
    const postId = Number(req.params.postId);

    LikeRepository.toggle(userId, postId);

    return res.status(200).json({
      success: true,
      message: "Like status updated",
    });
  }

  fetchLikesByPost(req, res) {
    const postId = Number(req.params.postId);

    const likeList = LikeRepository.findByPostId(postId);

    return res.status(200).json({
      success: true,
      likes: likeList,
    });
  }
}
