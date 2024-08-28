const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const compare = await bcrypt.compare(password, user.password);

      if (compare) {
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

          return res.send({
            _id,
            name,
            email,
            role,
            isVerified,
          });
        }
      }

      return next({ status: 401, message: "Password was wrong." });
    }

    return next({ status: 404, message: "User not found." });
  } catch (err) {
    next({ message: "User signin failed." });
  }
};

const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return next({ status: 409, message: "User already exists." });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    if (password) {
      const user = await User.create({ ...req.body, password });

      if (user) {
        // send verification email

        res
          .status(201)
          .send({ status: 201, message: "Verification email sent." });
      }
    }
  } catch (err) {
    next({ message: "User signup failed." });
  }
};

module.exports = { signin, signup };
