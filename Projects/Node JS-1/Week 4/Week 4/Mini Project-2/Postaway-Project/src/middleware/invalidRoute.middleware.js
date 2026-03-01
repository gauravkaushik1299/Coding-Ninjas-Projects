/**
 * Handles requests to undefined routes.
 * This should be placed after all valid route registrations.
 */
export const invalidRouteHandlerMiddleware = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
