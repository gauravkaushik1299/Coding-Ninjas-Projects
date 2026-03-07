import jwt from "jsonwebtoken";

/**
 * Generate short-lived access token
 */
export const createAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET || "dev-access-secret",
    { expiresIn: "15m" },
  );
};

/**
 * Generate long-lived refresh token
 */
export const createRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret",
    { expiresIn: "7d" },
  );
};

/**
 * Verify a JWT token
 */
export const verifyJwtToken = (token, secret) => {
  try {
    const decodedPayload = jwt.verify(token, secret);
    return {
      valid: true,
      payload: decodedPayload,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Decode token without verifying signature
 * Useful for debugging or extracting metadata
 */
export const decodeJwtToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

/**
 * Middleware to validate access tokens
 * Attaches decoded payload to req.user
 */
export const requireAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  const { valid, payload, error } = verifyJwtToken(
    token,
    process.env.ACCESS_TOKEN_SECRET,
  );

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error,
    });
  }

  req.user = payload;
  next();
};

/**
 * Validate refresh token
 */
export const verifyRefreshToken = (refreshToken) => {
  return verifyJwtToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};
