const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getSalesByDate,
  getTopProducts,
  getSalesGraph,
} = require("../controllers/reportController");

router.get("/dashboard", getDashboardStats);
router.get("/sales", getSalesByDate);
router.get("/top-products", getTopProducts);
router.get("/sales-graph", getSalesGraph);

module.exports = router;