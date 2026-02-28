// Please don't change the pre-written code
// Import the necessary modules here
import { logger } from "./logger.middleware.js";

export class customErrorHandler extends Error {
  constructor(statusCode, errMessage) {
    super(errMessage);
    this.statusCode = statusCode;
  }
}

export const errorHandlerMiddleware = (err, req, res, next) => {
  logger.error({
    level: "error",
    timestamp: new Date().toString(),
    "request URL": req.originalUrl,
    "error message": err.message,
  });

  if (err instanceof customErrorHandler) {
    return res.status(err.statusCode).json({
      success: false,
      msg: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    msg: "Oops! Something went wrong ... Please try again later!",
  });
};
