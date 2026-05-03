const mongoose = require("mongoose");
const { SERVICE_REQUEST_STATUSES } = require("../utils/constants");

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: "Entrepreneur", required: true },
    description: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    priceOffer: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(SERVICE_REQUEST_STATUSES),
      default: SERVICE_REQUEST_STATUSES.PENDING
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
