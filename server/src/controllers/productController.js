const Product = require("../models/Product");
const Entrepreneur = require("../models/Entrepreneur");
const { ROLES } = require("../utils/constants");
const { isNonEmptyString, isPositiveNumber, sanitizeString } = require("../utils/validation");

exports.getAll = async (req, res) => {
  const filters = {};
  const category = sanitizeString(req.query.category);
  if (category) filters.category = category;

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filters.price = {};
    if (!Number.isNaN(minPrice)) filters.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filters.price.$lte = maxPrice;
  }

  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const skip = Number(req.query.skip) || 0;

  const [data, total] = await Promise.all([
    Product.find(filters).populate("entrepreneur").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filters)
  ]);

  res.json({ data, pagination: { total, limit, skip } });
};

exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("entrepreneur");
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ data: product });
};

exports.create = async (req, res) => {
  if (req.user.role !== ROLES.ENTREPRENEUR) {
    return res.status(403).json({ message: "Only entrepreneurs can create products" });
  }

  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  if (!entrepreneur) return res.status(404).json({ message: "Entrepreneur profile missing" });

  if (!isNonEmptyString(req.body.name) || !isPositiveNumber(Number(req.body.price))) {
    return res.status(400).json({ message: "Invalid product name or price" });
  }

  const product = await Product.create({
    ...req.body,
    price: Number(req.body.price),
    entrepreneur: entrepreneur._id
  });
  res.status(201).json({ data: product });
};

exports.update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  if (req.user.role !== ROLES.ADMIN) {
    if (req.user.role !== ROLES.ENTREPRENEUR) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
    if (!entrepreneur || product.entrepreneur.toString() !== entrepreneur._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  if (req.body.name !== undefined && !isNonEmptyString(req.body.name)) {
    return res.status(400).json({ message: "Invalid product name" });
  }
  if (req.body.price !== undefined && !isPositiveNumber(Number(req.body.price))) {
    return res.status(400).json({ message: "Invalid product price" });
  }

  Object.assign(product, req.body);
  if (req.body.price !== undefined) {
    product.price = Number(req.body.price);
  }
  await product.save();
  res.json({ data: product });
};

exports.remove = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  if (req.user.role !== ROLES.ADMIN) {
    if (req.user.role !== ROLES.ENTREPRENEUR) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
    if (!entrepreneur || product.entrepreneur.toString() !== entrepreneur._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  await product.deleteOne();
  res.json({ message: "Deleted" });
};
