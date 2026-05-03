const Entrepreneur = require("../models/Entrepreneur");
const { ROLES } = require("../utils/constants");
const { sanitizeString } = require("../utils/validation");

exports.getAll = async (req, res) => {
  const filters = { isApproved: true };
  const category = sanitizeString(req.query.category);
  const location = sanitizeString(req.query.location);

  if (category) filters.category = category;
  if (location) filters.location = new RegExp(location, "i");

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filters.basePrice = {};
    if (!Number.isNaN(minPrice)) filters.basePrice.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filters.basePrice.$lte = maxPrice;
  }

  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const skip = Number(req.query.skip) || 0;

  const [data, total] = await Promise.all([
    Entrepreneur.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Entrepreneur.countDocuments(filters)
  ]);

  res.json({ data, pagination: { total, limit, skip } });
};

exports.getById = async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);
  if (!entrepreneur || !entrepreneur.isApproved) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ data: entrepreneur });
};

exports.getMe = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  if (!entrepreneur) return res.status(404).json({ message: "Not found" });
  res.json({ data: entrepreneur });
};

exports.create = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.create({ ...req.body, user: req.user._id });
    res.status(201).json({ data: entrepreneur });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Entrepreneur profile already exists" });
    }
    return res.status(500).json({ message: "Failed to create entrepreneur" });
  }
};

exports.update = async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);
  if (!entrepreneur) return res.status(404).json({ message: "Not found" });

  if (req.user.role !== ROLES.ADMIN) {
    if (entrepreneur.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  Object.assign(entrepreneur, req.body);
  await entrepreneur.save();
  res.json({ data: entrepreneur });
};

exports.approve = async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);
  if (!entrepreneur) return res.status(404).json({ message: "Not found" });
  entrepreneur.isApproved = true;
  await entrepreneur.save();
  res.json({ data: entrepreneur });
};
