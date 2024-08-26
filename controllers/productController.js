const Product = require("../models/productModel");
const { uploadImage, destroyImage } = require("../utils/cloudinary");

// Get all products
const getProducts = async (req, res, next) => {
  try {
    const { page, createdBy } = req.query;
    const skip = page > 1 ? (page - 1) * 6 : 0;

    if (createdBy) {
      const products = await Product.find({ createdBy }).limit(6).skip(skip);
      const total = await Product.countDocuments({ createdBy });
      return res.send({ products, total });
    }

    const products = await Product.find({}).limit(6).skip(skip);
    const total = await Product.countDocuments();

    res.send({ products, total });
  } catch (err) {
    next({ message: "Fetch products request failed." });
  }
};

// Get single product
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.send({ product });
  } catch (err) {
    next({ message: "Fetch product request failed." });
  }
};

// Create product
const createProduct = async (req, res, next) => {
  try {
    const productImage = await uploadImage(req.file.path);
    const product = await Product.create({ ...req.body, productImage });

    res.status(201).send(product);
  } catch (err) {
    next({ message: "Create product request failed." });
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    // Only supplier can update product
    // So, we need to check if user is supplier
    // Image upload
  } catch (err) {
    next({ message: "Update product request failed." });
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productImage } = await Product.findById(id);
    await destroyImage(productImage);
    const response = await Product.findByIdAndDelete(id);

    res.send(response);
  } catch (err) {
    next({ message: "Delete product request failed." });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
