const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
  },

  sku: {
    type: String,
    unique: true,
    default: () => "SKU-" + Date.now(),
  },

  category: {
    type: String,
    default: "General",
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  barcode: {
    type: String,
    unique: true,        // 🔥 IMPORTANT
    sparse: true,        // allow null but unique when exists
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },

},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Product", productSchema);