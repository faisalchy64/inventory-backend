const express = require("express");
const {
  productValidation,
  productValidationCheck,
} = require("../middlewares/productValidation");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/products", getProducts);

router.get("/products/:id", getProduct);

router.post(
  "/products",
  upload.single("productImage"),
  productValidation,
  productValidationCheck,
  createProduct
);

router.patch(
  "/products/:id",
  upload.single("productImage"),
  productValidation,
  productValidationCheck,
  updateProduct
);

router.delete("/products/:id", deleteProduct);

module.exports = router;
