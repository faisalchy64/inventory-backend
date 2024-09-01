const { unlinkSync } = require("fs");
const { check, validationResult } = require("express-validator");

const productUpdateValidation = [
  check("productName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters needed.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Product name should contain only alphabets.")
    .trim(),
  check("productImage")
    .optional()
    .custom(async (value, { req }) => {
      if (req.file && req.file.mimetype.includes("image") === false) {
        unlinkSync(req.file.path);
        throw new Error("Only image files are allowed.");
      }
    }),
  check("productDescription")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters needed.")
    .isAlpha("en-US", { ignore: " -." })
    .withMessage("Product description should contain only alphabets.")
    .trim(),
  check("productPrice")
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage("Product price should contain only numbers.")
    .trim(),
  check("productQuantity")
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage("Product quantity should contain only numbers.")
    .trim(),
  check("productUnit")
    .optional()
    .isIn(["kg", "dozen", "piece"])
    .withMessage("Only kg, dozen and piece units are allowed.")
    .trim(),
  check("minimumQuantity")
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage("Minimum order quantity should contain only numbers.")
    .trim(),
];

const productUpdateValidationCheck = (req, res, next) => {
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

module.exports = { productUpdateValidation, productUpdateValidationCheck };