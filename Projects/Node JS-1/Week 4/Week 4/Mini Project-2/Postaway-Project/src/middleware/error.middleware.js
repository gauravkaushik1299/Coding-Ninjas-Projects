/**
 * Custom API Error class to standardize error handling across the application.
 * This allows us to control HTTP status codes and client-facing messages.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

/**
 * Global error handling middleware.
 * Captures both known (ApiError) and unexpected errors.
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
  // Known application errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected/unhandled errors
  console.error(`[Unhandled Error] ${err.message}`);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
