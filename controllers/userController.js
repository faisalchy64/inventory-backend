const bcrypt = require("bcrypt");
const { generateToken, generateTokens } = require("../utils/tokens");
const mailSender = require("../utils/mailSender");
const User = require("../models/userModel");

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const compare = await bcrypt.compare(password, user.password);

      if (compare) {
        const { _id, name, email, role, isVerified } = user;
        const { accessToken, refreshToken } = generateTokens({
          _id,
          name,
          email,
          role,
          isVerified,
        });

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

      return next({ status: 401, message: "Incorrect email or password." });
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

        const token = generateToken(user._id, "5m");

        await mailSender(
          user.email,
          "Verify your account.",
          `
          <div style="padding: 1.5rem">
            <h1>Confirm your account</h1>
            <p>
              Thank you for signing up for Inventory Management Application. To confirm
              your account, please follow the button below.
            </p>
            <a
              href="${process.env.CORS_ORIGIN}/verify/${token}"
              style="
                display: inline-block;
                color: #fff;
                text-decoration: none;
                background-color: #000;
                padding: 1rem 1.5rem;
                margin: 0.5rem 0;
                border-radius: 0.35rem;
              "
              >Confirm Account
            </a>
          </div>
          `
        );

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
