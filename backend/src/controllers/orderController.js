const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// ==========================
// ✅ CREATE ORDER
// ==========================
const createOrder = async (req, res) => {
  try {
    // 🔥 UPDATED
    const { items, paymentMethod, customerName, customerPhone } = req.body;

    // ✅ VALIDATION
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 🔥 PHONE REQUIRED
    if (!customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 🔄 LOOP ITEMS
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} out of stock`,
        });
      }

      // 🔥 UPDATE STOCK
      product.stock -= item.quantity;
      await product.save();

      // 💰 SECURE PRICE
      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 🧾 CREATE ORDER (🔥 UPDATED)
    const order = await Order.create({
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "cash",

      // 🔥 NEW FIELDS
      customerName,
      customerPhone,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully ✅",
      order,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// ✅ GET ALL ORDERS
// ==========================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price sku")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
};