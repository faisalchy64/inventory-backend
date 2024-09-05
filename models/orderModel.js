const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Product id is required."],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required."],
    },
    totalQuantity: {
      type: Number,
      required: [true, "Total quantity is required."],
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "canceled"],
      default: "pending",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required."],
    },
    supplierId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Supplier id is required."],
    },
    address: {
      type: String,
      required: [true, "Address is required."],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
