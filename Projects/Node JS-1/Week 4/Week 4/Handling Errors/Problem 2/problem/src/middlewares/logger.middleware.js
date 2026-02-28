// Please don't change the pre-written code
// Import the necessary modules here

import winston from "winston";

// Create winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.File({ filename: "combined.log" })],
});

// Write your code here
export const loggerMiddleware = async (req, res, next) => {
  logger.info(
    `${new Date().toString()}
req URL: ${req.originalUrl}
reqBody: ${JSON.stringify(req.body)}`,
  );

  next();
};

export default loggerMiddleware;
