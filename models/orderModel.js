const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Id is required."],
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
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Id is required."],
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Id is required."],
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
