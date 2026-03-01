// third-party imports
import jwt from "jsonwebtoken";

// local imports
import UserRepository from "../models/user.model.js";

export default class UserController {
  /**
   * Retrieve all registered users.
   * Intended for admin-level visibility.
   */
  fetchAllUsers(req, res) {
    const users = UserRepository.findAll();

    return res.status(200).json({
      success: true,
      users,
    });
  }

  /**
   * Register a new user.
   */
  registerUser(req, res) {
    const { name, email, password } = req.body;

    UserRepository.create(name, email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  }

  /**
   * Authenticate user and generate JWT token.
   */
  loginUser(req, res) {
    const { email, password } = req.body;

    const user = UserRepository.authenticate(email, password);

    // Token payload kept minimal for security reasons
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  }
}
