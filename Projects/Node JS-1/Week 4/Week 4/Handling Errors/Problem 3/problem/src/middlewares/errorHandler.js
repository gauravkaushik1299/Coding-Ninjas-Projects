// Please don't change the pre-written code

export class customErrorHandler extends Error {
  constructor(statusCode, errMessage) {
    super(errMessage);
    this.statusCode = statusCode;
  }
}

export const errorHandlerMiddleware = (err, req, res, next) => {
  // Handle custom (intentionally thrown) errors
  if (err instanceof customErrorHandler) {
    return res.status(err.statusCode).json({
      success: false,
      msg: err.message,
    });
  }

  // Handle unhandled / unexpected errors
  return res.status(500).json({
    success: false,
    msg: "Oops! Something went wrong ... Please try again later!",
  });
};
