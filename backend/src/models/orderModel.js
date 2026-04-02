const mongoose = require("mongoose");

// 📦 ITEM SCHEMA (clean separation)
const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

// 🧾 ORDER SCHEMA
const orderSchema = new mongoose.Schema(
  {
    items: [itemSchema],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      default: "cash",
    },

    // 🔥 CUSTOMER INFO
    customerName: {
      type: String,
      trim: true,
      default: "Guest",
    },

    customerPhone: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔥 OPTIONAL (future use)
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);