const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: "Entrepreneur", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
