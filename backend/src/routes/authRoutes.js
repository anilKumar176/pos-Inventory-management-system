const express = require("express");

const {
  registerUser,
  loginUser,
  createUserByAdmin,
  getAllUsers,
  getUserCount,
  deleteUser,
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN ROUTES
router.post("/create", protect, authorizeRoles("admin"), createUserByAdmin);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/count", protect, authorizeRoles("admin"), getUserCount);

// OPTIONAL DELETE
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;