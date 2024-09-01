const express = require("express");
const {
  signinValidation,
  signupValidation,
  signinValidationCheck,
  signupValidationCheck,
} = require("../middlewares/userValidation");
const { signin, signup, userVerify } = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinValidation, signinValidationCheck, signin);

router.post("/signup", signupValidation, signupValidationCheck, signup);

router.get("/verify/:token", userVerify);

module.exports = router;
