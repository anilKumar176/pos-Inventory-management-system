const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// ==========================
// 📊 DASHBOARD STATS
// ==========================
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    const lowStockProducts = await Product.find({ stock: { $lt: 5 } });

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// 📅 SALES BY DATE
// ==========================
const getSalesByDate = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// 🏆 TOP PRODUCTS
// ==========================
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// 📈 SALES GRAPH
// ==========================
const getSalesGraph = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = sales.map((s) => ({
      date: s._id,
      totalRevenue: s.totalRevenue,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
module.exports = {
  getDashboardStats,
  getSalesByDate,
  getTopProducts,
  getSalesGraph,
};