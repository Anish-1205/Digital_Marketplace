const Order = require("../models/Order");
const Product = require("../models/Product");
const Entrepreneur = require("../models/Entrepreneur");
const { ROLES, ORDER_STATUSES } = require("../utils/constants");
const { isPositiveNumber } = require("../utils/validation");

exports.getAll = async (req, res) => {
  let query = { customer: req.user._id };

  if (req.user.role === ROLES.ENTREPRENEUR) {
    const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
    if (!entrepreneur) return res.status(404).json({ message: "Entrepreneur profile missing" });
    const products = await Product.find({ entrepreneur: entrepreneur._id }).select("_id");
    query = { product: { $in: products.map((item) => item._id) } };
  } else if (req.user.role === ROLES.ADMIN) {
    query = {};
  }

  const data = await Order.find(query).populate("product");
  res.json({ data });
};

exports.create = async (req, res) => {
  const quantity = Number(req.body.quantity ?? 1);
  if (!Number.isInteger(quantity) || !isPositiveNumber(quantity)) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const order = await Order.create({
    ...req.body,
    quantity,
    customer: req.user._id
  });
  res.status(201).json({ data: order });
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("product");
  if (!order) return res.status(404).json({ message: "Not found" });

  const nextStatus = req.body.status;
  if (!Object.values(ORDER_STATUSES).includes(nextStatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (req.user.role !== ROLES.ADMIN) {
    if (req.user.role !== ROLES.ENTREPRENEUR) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
    if (!entrepreneur || order.product.entrepreneur.toString() !== entrepreneur._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  order.status = nextStatus;
  await order.save();
  res.json({ data: order });
};
