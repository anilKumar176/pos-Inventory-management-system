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
  getLowStockProducts
} = require("../controllers/productController");

/*
CREATE PRODUCT
Only admin can create products
*/
router.post("/create", protect, authorizeRoles("admin"), createProduct);

/*
SEARCH PRODUCTS
Example:
GET /api/products/search?keyword=nike
*/
router.get("/search", searchProducts);
router.get("/barcode/:barcode", getProductByBarcode);
router.get("/low-stock", getLowStockProducts);
/*
GET ALL PRODUCTS
*/
router.get("/", getProducts);

/*
GET SINGLE PRODUCT
*/
router.get("/:id", getProductById);

/*
UPDATE PRODUCT
Only admin allowed
*/
router.put("/:id", protect, authorizeRoles("admin"), updateProduct);

/*
DELETE PRODUCT
Only admin allowed
*/
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);



module.exports = router;