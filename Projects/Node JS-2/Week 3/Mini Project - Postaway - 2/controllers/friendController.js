import User from "../models/userModel.js";

/**
 * Retrieve a list of friends for a specific user
 */
export const fetchUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRecord = await User.findById(userId).populate(
      "friends",
      "name email",
    );

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    return res.status(200).json({
      success: true,
      totalFriends: userRecord.friends.length,
      friends: userRecord.friends,
    });
  } catch (error) {
    console.error("Fetch friends error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve friends list",
    });
  }
};

/**
 * Retrieve pending friend requests for the logged-in user
 */
export const fetchPendingFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const userRecord = await User.findById(currentUserId).populate(
      "pendingRequests",
      "name email",
    );

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    return res.status(200).json({
      success: true,
      totalRequests: userRecord.pendingRequests.length,
      requests: userRecord.pendingRequests,
    });
  } catch (error) {
    console.error("Pending request fetch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pending friend requests",
    });
  }
};

/**
 * Toggle friendship action
 * Handles:
 *  - Sending friend request
 *  - Cancelling request
 *  - Removing existing friend
 */
export const manageFriendship = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { friendId } = req.params;

    if (currentUserId.toString() === friendId) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a friend",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(friendId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If already friends → remove friendship
    if (currentUser.friends.includes(friendId)) {
      currentUser.friends = currentUser.friends.filter(
        (id) => id.toString() !== friendId,
      );

      targetUser.friends = targetUser.friends.filter(
        (id) => id.toString() !== currentUserId.toString(),
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        message: "Friend removed successfully",
      });
    }

    // If friend request already sent
    if (targetUser.pendingRequests.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "Friend request already pending",
      });
    }

    // Send friend request
    targetUser.pendingRequests.push(currentUserId);
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.error("Friendship toggle error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process friendship action",
    });
  }
};

/**
 * Accept or reject a friend request
 */
export const handleFriendRequestResponse = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { friendId } = req.params;
    const { response } = req.body;

    if (!response || !["accept", "reject"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Response must be either 'accept' or 'reject'",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const requestingUser = await User.findById(friendId);

    if (!currentUser || !requestingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.pendingRequests.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: "No pending request from this user",
      });
    }

    if (response === "accept") {
      // Establish mutual friendship
      currentUser.friends.push(friendId);
      requestingUser.friends.push(currentUserId);
    }

    // Remove request from pending list
    currentUser.pendingRequests = currentUser.pendingRequests.filter(
      (id) => id.toString() !== friendId,
    );

    await currentUser.save();
    await requestingUser.save();

    return res.status(200).json({
      success: true,
      message:
        response === "accept"
          ? "Friend request accepted"
          : "Friend request rejected",
    });
  } catch (error) {
    console.error("Friend request response error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process friend request response",
    });
  }
};
