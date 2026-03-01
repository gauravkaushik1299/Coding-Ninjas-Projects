import { ApiError } from "../../../middleware/error.middleware.js";

// In-memory storage for users.
// Keeping user data isolated inside this module avoids accidental mutation.
let userStore = [];
let userIdCounter = 1;

export default class UserRepository {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // In real apps this should be hashed
  }

  /**
   * Retrieve all registered users.
   */
  static findAll() {
    return userStore;
  }

  /**
   * Register a new user.
   */
  static create(name, email, password) {
    if (!name || name.trim().length < 3) {
      throw new ApiError(400, "Name must be at least 3 characters long");
    }

    if (!email || !email.includes("@")) {
      throw new ApiError(400, "Valid email is required");
    }

    if (!password || password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // Check for duplicate email before creating user
    const existingUser = userStore.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      throw new ApiError(400, "Email is already registered");
    }

    const newUser = new UserRepository(
      userIdCounter++, // prevents duplicate IDs after deletions
      name.trim(),
      email.toLowerCase(),
      password,
    );

    userStore.push(newUser);

    return newUser;
  }

  /**
   * Authenticate user credentials.
   */
  static authenticate(email, password) {
    const user = userStore.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.password !== password) {
      throw new ApiError(400, "Invalid email or password");
    }

    return user;
  }
}
