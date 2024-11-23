const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// Get all orders
const getOreders = async (req, res, next) => {
  try {
    const { page, userId, supplierId } = req.query;
    const skip = page > 1 ? (page - 1) * 6 : 0;

    if (userId || supplierId) {
      const orders = await Order.find({ $or: [{ userId }, { supplierId }] })
        .limit(6)
        .skip(skip);

      const total = await Order.countDocuments({
        $or: [{ userId }, { supplierId }],
      });

      return res.send({ orders, total });
    }

    next({ status: 404, message: "No orders found" });
  } catch (err) {
    next({ message: "Fetch orders request failed." });
  }
};

// Create order
const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create({ ...req.body });

    if (order) {
      await Product.findByIdAndUpdate(order.product, {
        $inc: { productQuantity: -order.totalQuantity },
      });
    }

    res.status(201).send(order);
  } catch (err) {
    next({ message: "Create order request failed." });
  }
};

// Update order
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const states = ["pending", "delivered", "canceled"];

    if (states.includes(status)) {
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      return res.send(order);
    }

    next({ status: 409, message: "Invalid order status." });
  } catch (err) {
    next({ message: "Update order request failed." });
  }
};

module.exports = { getOreders, createOrder, updateOrder };
