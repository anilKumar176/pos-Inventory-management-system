const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductByBarcode,
  getLowStockProducts,
} = require("../controllers/productController");


// =============================
// 📦 PRODUCT ROUTES
// =============================

// ➕ CREATE PRODUCT (ADMIN ONLY)
router.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  createProduct
);


// 🔍 SEARCH PRODUCTS
// GET /api/products/search?keyword=abc
router.get("/search", searchProducts);


// 🔥 BARCODE SCAN (VERY IMPORTANT)
router.get("/barcode/:barcode", getProductByBarcode);


// ⚠️ LOW STOCK PRODUCTS
router.get("/low-stock", getLowStockProducts);


// 📦 GET ALL PRODUCTS
router.get("/", getProducts);


// 🔍 GET SINGLE PRODUCT
router.get("/:id", getProductById);


// ✏️ UPDATE PRODUCT (ADMIN ONLY)
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateProduct
);


// ❌ DELETE PRODUCT (ADMIN ONLY)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);


module.exports = router;