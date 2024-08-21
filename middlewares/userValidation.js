const { check, validationResult } = require("express-validator");

const signinValidation = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Give a valid email.")
    .trim(),
  check("password").not().isEmpty().withMessage("Password is required.").trim(),
];

const signupValidation = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters needed.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name should contain only alphabets.")
    .trim(),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Give a valid email.")
    .trim(),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({ minLength: 8, minUppercase: 0 })
    .withMessage(
      "Minimum 8 characters needed (at least one letter, one digit and one special character)."
    )
    .trim(),
  check("role")
    .isISIN(["user", "supplier"])
    .withMessage("Only user and supplier roles are allowed.")
    .trim(),
];

const signinValidationCheck = (req, res, next) => {
  const errors = validationResult(req).mapped();

  if (Object.keys(errors).length === 0) {
    next();
  } else {
    const result = {};
    Object.keys(errors).forEach((error) => {
      result[error] = errors[error].msg;
    });

    res.status(500).send(result);
  }
};

const signupValidationCheck = (req, res, next) => {
  const errors = validationResult(req).mapped();

  if (Object.keys(errors).length === 0) {
    next();
  } else {
    const result = {};
    Object.keys(errors).forEach((error) => {
      result[error] = errors[error].msg;
    });

    res.status(500).send(result);
  }
};

module.exports = {
  signinValidation,
  signupValidation,
  signinValidationCheck,
  signupValidationCheck,
};
