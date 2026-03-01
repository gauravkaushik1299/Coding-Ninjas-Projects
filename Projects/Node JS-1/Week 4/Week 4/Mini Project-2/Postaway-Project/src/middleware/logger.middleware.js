import winston from "winston";

/**
 * Winston logger configuration.
 * Logs structured JSON data to combined.log.
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "postaway-api" },
  transports: [new winston.transports.File({ filename: "combined.log" })],
});

/**
 * Logs request details for all routes except user authentication routes.
 */
export const loggerMiddleware = (req, res, next) => {
  // Skip logging for user auth routes
  if (req.baseUrl.includes("/api") && !req.baseUrl.includes("/api/users")) {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      userId: req.userId || null,
    });
  }

  next();
};

export default loggerMiddleware;
