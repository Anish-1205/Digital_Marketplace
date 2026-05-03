const Entrepreneur = require("../models/Entrepreneur");

exports.getAll = async (req, res) => {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.location) filters.location = new RegExp(req.query.location, "i");
  const data = await Entrepreneur.find(filters).where({ isApproved: true });
  res.json({ data });
};

exports.getById = async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);
  if (!entrepreneur) return res.status(404).json({ message: "Not found" });
  res.json({ data: entrepreneur });
};

exports.create = async (req, res) => {
  const entrepreneur = await Entrepreneur.create({ ...req.body, user: req.user._id });
  res.status(201).json({ data: entrepreneur });
};

exports.update = async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);
  if (!entrepreneur) return res.status(404).json({ message: "Not found" });
  if (entrepreneur.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
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
