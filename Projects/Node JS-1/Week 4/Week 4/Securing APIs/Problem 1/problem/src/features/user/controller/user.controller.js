// Please don't change the pre-written code
// Import the necessary modules here

import { addUser, confirmLogin } from "../model/user.model.js";

export const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;

  const user = addUser({ name, email, password });

  return res.status(201).json({
    status: "success",
    user: user,
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const isValid = confirmLogin({ email, password });

  if (isValid) {
    return res.status(200).json({
      status: "success",
      msg: "login successful",
    });
  }

  return res.status(400).json({
    status: "failure",
    msg: "invalid user details",
  });
};
