const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyJWT = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (accessToken === undefined) {
      return next({ status: 401, message: "Access token is missing." });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next({ status: 401, message: "Access token has expired." });
      }

      const user = await User.findById(decoded._id);

      if (user) {
        req.decoded = decoded;
        return next();
      }

      next({ status: 401, message: "Unauthorized user access." });
    });
  } catch (err) {
    next({ message: "User authorization failed." });
  }
};

module.exports = verifyJWT;
