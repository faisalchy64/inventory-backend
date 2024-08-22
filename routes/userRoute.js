const express = require("express");
const {
  signinValidation,
  signupValidation,
  signinValidationCheck,
  signupValidationCheck,
} = require("../middlewares/userValidation");
const { signin, signup } = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinValidation, signinValidationCheck, signin);

router.post("/signup", signupValidation, signupValidationCheck, signup);

module.exports = router;
