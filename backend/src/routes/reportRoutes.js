const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/reportController");
const { getSalesByDate } = require("../controllers/reportController");
// Add more report routes as needed
router.get("/dashboard", getDashboardStats);
router.get("/sales", getSalesByDate);

module.exports = router;