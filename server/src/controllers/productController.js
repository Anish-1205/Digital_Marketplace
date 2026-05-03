const Product = require("../models/Product");

exports.getAll = async (req, res) => {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  const data = await Product.find(filters).populate("entrepreneur");
  res.json({ data });
};

exports.create = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
};

exports.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ data: product });
};

exports.remove = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
