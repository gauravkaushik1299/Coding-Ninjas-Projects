/**
 * Global error handling middleware
 * This captures errors thrown anywhere in the request pipeline
 * and returns a standardized response to the client.
 */
const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Internal server error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorMessage = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  // Handle invalid ObjectId errors
  if (err.name === "CastError") {
    statusCode = 400;
    errorMessage = `Invalid value for ${err.path}: ${err.value}`;
  }

  // Handle duplicate key errors from MongoDB
  if (err.code === 11000) {
    statusCode = 409;
    errorMessage = "Duplicate field value detected";
  }

  // Server-side logging for debugging
  console.error("[Application Error]:", errorMessage);

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    // Stack trace shown only in development
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default globalErrorHandler;
