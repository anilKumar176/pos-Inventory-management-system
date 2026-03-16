const mongoose = require("mongoose");
//order Schema
const orderSchema = new mongoose.Schema(
{
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi"],
    default: "cash"
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Order", orderSchema);