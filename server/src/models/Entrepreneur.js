const mongoose = require("mongoose");

const entrepreneurSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: Number, default: 1 },
    basePrice: { type: Number, default: 0 },
    skills: [{ type: String }],
    availability: { type: String, default: "Available" },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entrepreneur", entrepreneurSchema);
