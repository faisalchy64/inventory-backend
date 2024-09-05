const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const verifySupplier = require("../middlewares/verifySupplier");
const {
  orderValidation,
  orderValidationCheck,
} = require("../middlewares/orderValidation");
const {
  getOreders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/orders", verifyJWT, getOreders);

router.post(
  "/orders",
  verifyJWT,
  orderValidation,
  orderValidationCheck,
  createOrder
);

router.patch("/orders/:id", verifyJWT, verifySupplier, updateOrder);

module.exports = router;
