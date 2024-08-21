const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required."],
      lowercase: true,
      trim: true,
    },
    productImage: {
      type: String,
      required: [true, "Product image is required."],
    },
    productDescription: {
      type: String,
      required: [true, "Product description is required."],
    },
    productPrice: {
      type: Number,
      required: [true, "Product price is required."],
    },
    productQuantity: {
      type: Number,
      required: [true, "Product quantity is required."],
    },
    productUnit: {
      type: String,
      required: [true, "Product unit is required."],
      enum: ["kg", "dozen", "piece"],
    },
    minimumQuantity: {
      type: Number,
      required: [true, "Minimum quantity is required."],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Created-by is required."],
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        message: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
