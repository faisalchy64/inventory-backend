const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
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
  verifyJWT,
  upload.single("productImage"),
  productValidation,
  productValidationCheck,
  createProduct
);

router.patch(
  "/products/:id",
  verifyJWT,
  upload.single("productImage"),
  productValidation,
  productValidationCheck,
  updateProduct
);

router.delete("/products/:id", verifyJWT, deleteProduct);

module.exports = router;
