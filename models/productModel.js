const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Name is required."],
      lowercase: true,
      trim: true,
    },
    productImage: {
      type: String,
      required: [true, "Image is required."],
    },
    productDescription: {
      type: String,
      required: [true, "Description is required."],
    },
    productPrice: {
      type: Number,
      required: [true, "Price is required."],
    },
    productQuantity: {
      type: Number,
      required: [true, "Quantity is required."],
    },
    productMeasure: {
      type: String,
      required: [true, "Measure is required."],
      enum: ["kg", "dozen", "piece"],
    },
    minimumQuantity: {
      type: Number,
      required: [true, "Minimum quantity is required."],
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Id is required."],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
