const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

// ROUTES
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const authRoutes = require("./src/routes/authRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

const app = express();

// 🧩 MIDDLEWARES (move outside async)
app.use(cors());
app.use(express.json());

// 🔗 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

// 🧪 TEST ROUTE
app.get("/", (req, res) => {
  res.send("POS API Running 🚀");
});

// ❌ GLOBAL ERROR HANDLER (SAFE)
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    message: err.message || "Server Error",
  });
});

//  START SERVER
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🔥`);
    });

  } catch (error) {
    console.error("Server Error:", error.message);
    process.exit(1);
  }
};

startServer();