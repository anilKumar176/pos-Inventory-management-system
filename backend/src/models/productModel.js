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
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔥 BARCODE FIELD (UPDATED)
    barcode: {
      type: String,
      unique: true,      // same barcode repeat nahi hoga
      sparse: true,      // null allowed but unique when present
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
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