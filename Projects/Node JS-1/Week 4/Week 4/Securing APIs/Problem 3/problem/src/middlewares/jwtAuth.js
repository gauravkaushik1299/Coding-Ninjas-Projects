import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "jwt token missing",
      });
    }

    jwt.verify(token, "jwt-secret-key");
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: error.message,
    });
  }
};

export default jwtAuth;
