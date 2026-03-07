import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * User Schema
 * Represents registered users on the platform.
 * Includes authentication fields, friendships, and profile information.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },

    /**
     * Optional user avatar image
     */
    avatar: {
      type: String,
      default: null,
    },

    /**
     * Active authentication tokens
     * Used for logout from individual devices
     */
    activeTokens: [String],

    /**
     * Friends list
     */
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /**
     * Pending friend requests
     */
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

/**
 * Hash password automatically before saving
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compare entered password with stored hashed password
 */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Improve lookup speed for login operations
 */
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
