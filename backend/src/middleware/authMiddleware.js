const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// 🔐 PROTECT MIDDLEWARE
const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    // ✅ CHECK HEADER
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

    // 🔍 GET USER FROM DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // ✅ ATTACH USER
    req.user = user;

    next(); // ✅ VERY IMPORTANT

  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// 👑 ROLE AUTHORIZATION
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // ❌ USER NOT FOUND
      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      // ❌ ROLE NOT MATCH
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next(); // ✅ VERY IMPORTANT

    } catch (error) {
      console.log("ROLE ERROR:", error);

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