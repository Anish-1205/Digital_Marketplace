const mongoose = require("mongoose");
const { ORDER_STATUSES } = require("../utils/constants");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.PLACED
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
