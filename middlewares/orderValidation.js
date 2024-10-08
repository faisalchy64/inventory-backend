const { check, validationResult } = require("express-validator");

const orderValidation = [
  check("product").not().isEmpty().withMessage("Id is required.").trim(),
  check("totalPrice")
    .not()
    .isEmpty()
    .withMessage("Total price is required.")
    .isNumeric({ no_symbols: true })
    .withMessage("Total price should contain only numbers.")
    .trim(),
  check("totalQuantity")
    .not()
    .isEmpty()
    .withMessage("Total quantity is required.")
    .isNumeric({ no_symbols: true })
    .withMessage("Total quantity should contain only numbers.")
    .trim(),
  check("user").not().isEmpty().withMessage("Id is required.").trim(),
  check("supplier").not().isEmpty().withMessage("Id is required.").trim(),
  check("address").not().isEmpty().withMessage("Address is required.").trim(),
];

const orderValidationCheck = (req, res, next) => {
  const errors = validationResult(req).mapped();

  if (Object.keys(errors).length === 0) {
    next();
  } else {
    const result = {};
    Object.keys(errors).forEach((error) => {
      result[error] = errors[error].msg;
    });

    res.status(400).send(result);
  }
};

module.exports = { orderValidation, orderValidationCheck };
