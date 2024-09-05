const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const verifySupplier = require("../middlewares/verifySupplier");
const {
  productValidation,
  productUpdateValidation,
  productValidationCheck,
  productUpdateValidationCheck,
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
  verifySupplier,
  upload.single("productImage"),
  productValidation,
  productValidationCheck,
  createProduct
);

router.patch(
  "/products/:id",
  verifyJWT,
  verifySupplier,
  upload.single("productImage"),
  productUpdateValidation,
  productUpdateValidationCheck,
  updateProduct
);

router.delete("/products/:id", verifyJWT, verifySupplier, deleteProduct);

module.exports = router;
