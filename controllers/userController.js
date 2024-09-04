const bcrypt = require("bcrypt");
const {
  generateToken,
  generateTokens,
  verifyToken,
} = require("../utils/tokens");
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

          const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          };

          return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .send({
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

        res.status(201).send({ message: "Verification email sent." });
      }
    }
  } catch (err) {
    next({ message: "User signup failed." });
  }
};

const userVerify = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = verifyToken(token);
    const user = await User.findById(decoded && decoded._id);

    if (user && user.isVerified) {
      return next({ status: 409, message: "User already verified." });
    }

    if (user) {
      const response = await User.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        { new: true }
      ).select("name email role isVerified");

      return res.send(response);
    }

    return next({ status: 401, message: "Invalid verification token." });
  } catch (err) {
    next({ message: "User verification failed." });
  }
};

const signout = async (req, res, next) => {
  try {
    const { _id } = req.decoded;
    await User.findByIdAndUpdate(_id, { refreshToken: "" });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .send({ message: "Signout successful." });
  } catch (err) {
    next({ message: "User signout failed." });
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const user = await User.findOne({ refreshToken }).select(
      "name email role isVerified refreshToken"
    );

    if (user && user.refreshToken === refreshToken) {
      const decoded = verifyToken(refreshToken);

      if (decoded) {
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

          const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          };

          return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .send({
              _id,
              name,
              email,
              role,
              isVerified,
            });
        }
      }
    }

    return next({ status: 401, message: "Invalid refresh token." });
  } catch (err) {
    next({ message: "Failed to refresh access token." });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetPasswordToken = generateToken(user._id, "5m");
      await User.findByIdAndUpdate(user._id, { resetPasswordToken });
      await mailSender(
        user.email,
        "Reset your password.",
        `
        <div style="padding: 1.5rem">
          <h1>Reset your password</h1>
          <p>
            To reset your password, please follow the button below.
          </p>
          <a
            href="${process.env.CORS_ORIGIN}/verify/${resetPasswordToken}"
            style="
              display: inline-block;
              color: #fff;
              text-decoration: none;
              background-color: #000;
              padding: 1rem 1.5rem;
              margin: 0.5rem 0;
              border-radius: 0.35rem;
            "
            >Reset Password
          </a>
        </div>
        `
      );

      return res.send({ message: "Reset password email sent." });
    }

    return next({ status: 404, message: "User not found." });
  } catch (err) {
    next({ message: "Forgot password request failed." });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = verifyToken(token);
    const user = await User.findById(decoded && decoded._id);

    if (user && user.resetPasswordToken === token) {
      const password = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(user._id, {
        password,
        $unset: { resetPasswordToken: 1 },
      });

      return res.send({ message: "Reset password successful." });
    }

    next({ status: 401, message: "Expired or invalid reset password token." });
  } catch (err) {
    next({ message: "Reset password request failed." });
  }
};

module.exports = {
  signin,
  signup,
  userVerify,
  signout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
