const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// 🔐 PROTECT ROUTE (AUTH REQUIRED)
const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ GET TOKEN FROM HEADER
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ❌ NO TOKEN
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 🔐 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 FIND USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // ✅ ATTACH USER TO REQUEST
    req.user = user;

    next(); // ✅ IMPORTANT

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// 👑 ROLE BASED AUTH
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // ❌ USER NOT ATTACHED
      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      // ❌ ROLE CHECK
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next(); // ✅ IMPORTANT

    } catch (error) {
      console.log("ROLE ERROR:", error.message);

      return res.status(500).json({
        message: "Authorization failed",
      });
    }
  };
};

module.exports = {
  protect,
  authorizeRoles,
};