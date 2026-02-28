// Please don't change the pre-written code
// Import the necessary modules here

import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "log.txt");

const loggerMiddleware = (req, res, next) => {
  // log only /api/user routes
  if (req.originalUrl.startsWith("/api/user")) {
    const logData = `
${new Date().toString()}
req URL: ${req.originalUrl}
reqBody: ${JSON.stringify(req.body)}
`;

    fs.appendFileSync(logFilePath, logData);
  }

  next();
};

export default loggerMiddleware;
