const ServiceRequest = require("../models/ServiceRequest");
const Entrepreneur = require("../models/Entrepreneur");
const { ROLES, SERVICE_REQUEST_STATUSES } = require("../utils/constants");
const { isNonEmptyString, isPositiveNumber, isValidDate } = require("../utils/validation");

exports.getAll = async (req, res) => {
  let query = { customer: req.user._id };

  if (req.user.role === ROLES.ENTREPRENEUR) {
    const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
    if (!entrepreneur) return res.status(404).json({ message: "Entrepreneur profile missing" });
    query = { entrepreneur: entrepreneur._id };
  }

  const data = await ServiceRequest.find(query).populate("entrepreneur");
  res.json({ data });
};

exports.create = async (req, res) => {
  if (!isNonEmptyString(req.body.description)) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (!isValidDate(req.body.scheduledDate)) {
    return res.status(400).json({ message: "Invalid scheduled date" });
  }
  if (!isPositiveNumber(Number(req.body.priceOffer))) {
    return res.status(400).json({ message: "Invalid price offer" });
  }

  const request = await ServiceRequest.create({
    ...req.body,
    scheduledDate: new Date(req.body.scheduledDate),
    priceOffer: Number(req.body.priceOffer),
    customer: req.user._id
  });
  res.status(201).json({ data: request });
};

exports.updateStatus = async (req, res) => {
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Not found" });

  const nextStatus = req.body.status;
  if (!Object.values(SERVICE_REQUEST_STATUSES).includes(nextStatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (req.user.role !== ROLES.ADMIN) {
    if (req.user.role !== ROLES.ENTREPRENEUR) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
    if (!entrepreneur || request.entrepreneur.toString() !== entrepreneur._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  request.status = nextStatus;
  await request.save();
  res.json({ data: request });
};
