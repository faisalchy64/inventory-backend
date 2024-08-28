const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyJWT = async (req, res, next) => {
  try {
    const user = await User.findOne({ refreshToken });

    if (req.cookies && req.cookies.accessToken && req.cookies.refreshToken) {
      const { accessToken, refreshToken } = req.cookies;

      jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (user && user.refreshToken === refreshToken) {
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
              if (err) {
                return next({ status: 403, message: "Forbidden user access." });
              }

              if (decoded._id === user._id) {
                res.decoded = decoded;
                return next();
              }
            });
          }
        }

        if (decoded._id === user._id) {
          const { _id, name, email, role, isVerified } = user;
          const accessToken = jwt.sign(
            { _id, name, email, role, isVerified },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          const refreshToken = jwt.sign(
            { _id, name, email, role, isVerified },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );

          if (accessToken && refreshToken) {
            // save refresh token
            await User.findByIdAndUpdate(_id, { refreshToken });

            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 3600,
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 86400,
            });
          }

          res.decoded = decoded;
          return next();
        }
      });
    }

    next({ status: 401, message: "Unauthorized user access." });
  } catch (err) {
    next({ status: 401, message: "User authorization failed." });
  }
};

module.exports = verifyJWT;
