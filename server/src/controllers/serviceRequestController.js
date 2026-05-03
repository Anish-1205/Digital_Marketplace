const ServiceRequest = require("../models/ServiceRequest");

exports.getAll = async (req, res) => {
  const query = req.user.role === "entrepreneur" ? { } : { customer: req.user._id };
  const data = await ServiceRequest.find(query).populate("entrepreneur");
  res.json({ data });
};

exports.create = async (req, res) => {
  const request = await ServiceRequest.create({
    ...req.body,
    customer: req.user._id
  });
  res.status(201).json({ data: request });
};

exports.updateStatus = async (req, res) => {
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Not found" });
  request.status = req.body.status || request.status;
  await request.save();
  res.json({ data: request });
};
