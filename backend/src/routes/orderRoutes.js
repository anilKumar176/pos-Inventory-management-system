const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

//  CREATE ORDER
router.post("/", protect, createOrder);

//  GET ORDERS
router.get("/", protect, getOrders);

module.exports = router;