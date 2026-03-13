const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const getDashboardStats = async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments();

    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue =
      totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

    const totalProducts = await Product.countDocuments();

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSalesByDate = async (req, res) => {
  try {

    const { date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      date,
      totalOrders: orders.length,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDashboardStats,
  getSalesByDate
};