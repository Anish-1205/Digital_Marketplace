const User = require("../models/User");
const Entrepreneur = require("../models/Entrepreneur");
const Product = require("../models/Product");
const ServiceRequest = require("../models/ServiceRequest");
const Order = require("../models/Order");

exports.metrics = async (req, res) => {
  const [users, entrepreneurs, products, serviceRequests, orders] = await Promise.all([
    User.countDocuments(),
    Entrepreneur.countDocuments(),
    Product.countDocuments(),
    ServiceRequest.countDocuments(),
    Order.countDocuments()
  ]);

  res.json({
    data: {
      users,
      entrepreneurs,
      products,
      serviceRequests,
      orders
    }
  });
};

exports.listEntrepreneurs = async (req, res) => {
  const data = await Entrepreneur.find({ isApproved: false }).populate("user", "name email");
  res.json({ data });
};
