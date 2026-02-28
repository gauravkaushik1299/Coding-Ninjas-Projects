import jwt from "jsonwebtoken";
import { addUser, confirmLogin } from "../model/user.model.js";

export const registerUser = (req, res) => {
  const user = addUser(req.body);

  res.status(201).json({
    status: "success",
    user: user,
  });
};

export const loginUser = (req, res) => {
  const isValid = confirmLogin(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "failure",
      msg: "invalid user details",
    });
  }

  const token = jwt.sign({ email: req.body.email }, "jwt-secret-key", {
    expiresIn: "1h",
  });

  res.cookie("jwtToken", token, {
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    msg: "login successful",
  });
};
