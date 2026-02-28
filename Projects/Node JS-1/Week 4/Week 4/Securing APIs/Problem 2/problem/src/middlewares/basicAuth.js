// Please don't change the pre-written code
// Import the necessary modules here

import { confirmLogin } from "../features/user/model/user.model.js";

const basicAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).send("Unauthorized");
  }

  const encoded = authHeader.split(" ")[1];
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const [email, password] = decoded.split(":");

  const isValid = confirmLogin({ email, password });

  if (!isValid) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

export default basicAuthMiddleware;
