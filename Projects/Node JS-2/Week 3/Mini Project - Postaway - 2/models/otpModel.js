import mongoose from "mongoose";

/**
 * OTP Schema
 * Stores temporary OTP codes used for password reset verification.
 * Each OTP is associated with a user's email and expires automatically.
 */
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for OTP generation"],
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: [true, "OTP code is required"],
    },

    /**
     * Expiration timestamp for the OTP
     * Used to invalidate OTPs after a fixed duration.
     */
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Automatically remove expired OTP documents from the database.
 * MongoDB TTL index cleans them after expiry.
 */
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
