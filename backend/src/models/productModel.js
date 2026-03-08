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
    required: true,
    unique: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
  },

  barcode: {
    type: String,
  },

  description: {
    type: String,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Product", productSchema);