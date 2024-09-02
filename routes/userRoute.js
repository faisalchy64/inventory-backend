const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const {
  signinValidation,
  signupValidation,
  signinValidationCheck,
  signupValidationCheck,
} = require("../middlewares/userValidation");
const {
  signin,
  signup,
  signout,
  userVerify,
  refreshAccessToken,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinValidation, signinValidationCheck, signin);

router.post("/signup", signupValidation, signupValidationCheck, signup);

router.get("/verify/:token", userVerify);

router.get("/signout", verifyJWT, signout);

router.get("/refresh-token", refreshAccessToken);

module.exports = router;
