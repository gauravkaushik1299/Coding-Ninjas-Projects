import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Helper function for generating access and refresh tokens.
 * Keeping this separate improves readability and makes token logic reusable.
 */
const createAuthTokens = (userId) => {
  const payload = { userId };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET || "dev-access-secret",
    { expiresIn: "1h" },
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret",
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

/**
 * Register a new user
 */
export const createUserAccount = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
    });

    await newUser.save();

    const { accessToken, refreshToken } = createAuthTokens(newUser._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("User registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
};

/**
 * Authenticate user credentials
 */
export const authenticateUserAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await User.findOne({ email });

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    const passwordValid = await bcrypt.compare(password, userRecord.password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    const { accessToken, refreshToken } = createAuthTokens(userRecord._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login process failed",
    });
  }
};

/**
 * Logout user by clearing authentication cookies
 */
export const logoutCurrentUser = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * Logout from all devices
 * In a real implementation this would invalidate refresh tokens in DB.
 */
export const logoutFromAllSessions = async (req, res) => {
  try {
    // Placeholder for future token invalidation logic

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    console.error("Logout all sessions error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to logout from all sessions",
    });
  }
};

/**
 * Retrieve details of a specific user
 */
export const fetchUserProfile = async (req, res) => {
  try {
    const userRecord = await User.findById(req.params.userId).select(
      "-password",
    );

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: userRecord,
    });
  } catch (error) {
    console.error("Fetch user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};

/**
 * Retrieve all users (admin style endpoint)
 */
export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetch all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve users",
    });
  }
};

/**
 * Update user profile details
 */
export const modifyUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

/**
 * Update user avatar
 */
export const updateUserAvatar = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { avatar: req.file.path },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Avatar update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update avatar",
    });
  }
};
