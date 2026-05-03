const Review = require("../models/Review");

exports.getAll = async (req, res) => {
  const filters = {};
  if (req.query.entrepreneur) filters.entrepreneur = req.query.entrepreneur;
  if (req.query.product) filters.product = req.query.product;
  const data = await Review.find(filters).populate("customer", "name");
  res.json({ data });
};

exports.create = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    customer: req.user._id
  });
  res.status(201).json({ data: review });
};
