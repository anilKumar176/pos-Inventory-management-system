const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// ➕ CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      price,
      stock,
      barcode,
      description,
      image,
    } = req.body;

    // ✅ VALIDATION
    if (!name || !price) {
      return res.status(400).json({
        message: "Name and Price are required",
      });
    }

    // ✅ DUPLICATE SKU CHECK
    if (sku) {
      const exist = await Product.findOne({ sku });
      if (exist) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }
    }

    const product = new Product({
      name,
      sku,
      category,
      price,
      stock,
      barcode,
      description,
      image,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    console.log("CREATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET PRODUCTS (PAGINATION)
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments();

    res.json({
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });

  } catch (error) {
    console.log("GET ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🔍 GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    // ❌ SKU duplicate check on update
    if (req.body.sku) {
      const exist = await Product.findOne({ sku: req.body.sku });

      if (exist && exist._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {
    console.log("UPDATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🔍 SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 10 } = req.query;

    const query = {
      name: { $regex: keyword, $options: "i" },
    };

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      totalProducts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      products,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 BARCODE SEARCH
const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.barcode,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ LOW STOCK
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lt: 10 },
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 SALES REPORT
const getSalesByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      date,
      totalOrders: orders.length,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductByBarcode,
  getLowStockProducts,
  getSalesByDate,
};