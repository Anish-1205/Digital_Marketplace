const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: "Entrepreneur", required: true },
    description: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    priceOffer: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
