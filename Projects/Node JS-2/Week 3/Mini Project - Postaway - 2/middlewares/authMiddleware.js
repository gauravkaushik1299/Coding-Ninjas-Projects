import jwt from "jsonwebtoken";

/**
 * Authentication middleware
 * Validates the JWT token provided in the Authorization header.
 * If valid, the decoded payload is attached to req.user for downstream usage.
 */
export const verifyAuthToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Expecting header format: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedPayload = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret",
    );

    // Attach user info to request for later use in controllers
    req.user = decodedPayload;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
