import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

/**
 * Registers a new user account.
 * Performs duplicate email validation before creation.
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Basic request validation
    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      gender,
    });

    // Generate authentication token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "development-secret",
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      success: true,
      user: newUser,
      token,
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
 * Authenticates a user and generates a login token.
 */
export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await User.findOne({ email: email.toLowerCase() });

    if (!userRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Validate password using schema method
    const passwordValid = await userRecord.comparePassword(password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const authToken = jwt.sign(
      { id: userRecord._id },
      process.env.JWT_SECRET || "development-secret",
      { expiresIn: "7d" },
    );

    // Store active session token for multi-device logout support
    userRecord.activeTokens.push(authToken);
    await userRecord.save();

    return res.status(200).json({
      success: true,
      user: userRecord,
      token: authToken,
    });
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login process failed",
    });
  }
};

/**
 * Logs the user out from the current device.
 * Removes the active session token from the stored token list.
 */
export const logoutCurrentSession = async (req, res) => {
  try {
    const userRecord = await User.findById(req.user.id);

    userRecord.activeTokens = userRecord.activeTokens.filter(
      (token) => token !== req.token,
    );

    await userRecord.save();

    return res.status(200).json({
      success: true,
      message: "Successfully logged out from current device",
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Logout operation failed",
    });
  }
};

/**
 * Logs the user out from all devices by clearing all stored tokens.
 */
export const logoutFromAllSessions = async (req, res) => {
  try {
    const userRecord = await User.findById(req.user.id);

    userRecord.activeTokens = [];
    await userRecord.save();

    return res.status(200).json({
      success: true,
      message: "User logged out from all devices",
    });
  } catch (error) {
    console.error("Logout all devices error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log out from all devices",
    });
  }
};
