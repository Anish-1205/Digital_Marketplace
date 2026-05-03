const Order = require("../models/Order");

exports.getAll = async (req, res) => {
  const query = req.user.role === "customer" ? { customer: req.user._id } : {};
  const data = await Order.find(query).populate("product");
  res.json({ data });
};

exports.create = async (req, res) => {
  const order = await Order.create({
    ...req.body,
    customer: req.user._id
  });
  res.status(201).json({ data: order });
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.status = req.body.status || order.status;
  await order.save();
  res.json({ data: order });
};
