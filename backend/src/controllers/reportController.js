const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// ==========================
// 📊 DASHBOARD STATS
// ==========================
const getDashboardStats = async (req, res) => {
  try {
    // 🔥 PARALLEL EXECUTION (FASTER)
    const [totalOrders, totalProducts, orders, lowStockProducts] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Order.find(),
        Product.find({ stock: { $lt: 5 } }),
      ]);

    // 💰 TOTAL REVENUE
    const totalRevenue = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    // 👤 UNIQUE CUSTOMERS
    const uniqueCustomers = await Order.distinct("customerPhone");

    res.status(200).json({
      success: true,

      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,

      // 🔥 NEW
      totalCustomers: uniqueCustomers.length,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
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
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: sales,
    });

  } catch (error) {
    console.error("SALES DATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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

      // 🔥 PRODUCT DETAILS JOIN
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      {
        $project: {
          _id: 0,
          productId: "$product._id",
          productName: "$product.name",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });

  } catch (error) {
    console.error("TOP PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🔥 FORMAT FOR FRONTEND
    const formatted = sales.map((s) => ({
      date: s._id,
      totalRevenue: s.totalRevenue,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("SALES GRAPH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
module.exports = {
  getDashboardStats,
  getSalesByDate,
  getTopProducts,
  getSalesGraph,
};