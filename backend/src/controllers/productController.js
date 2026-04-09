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
    if (!name || price == null) {
      return res.status(400).json({
        message: "Name and Price are required",
      });
    }

    // ✅ SKU DUPLICATE
    if (sku) {
      const exist = await Product.findOne({ sku });
      if (exist) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    // ✅ BARCODE DUPLICATE
    if (barcode) {
      const existBarcode = await Product.findOne({ barcode });
      if (existBarcode) {
        return res.status(400).json({ message: "Barcode already exists" });
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
    res.status(500).json({ message: "Server Error" });
  }
};


// 📦 GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

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
    res.status(500).json({ message: "Server Error" });
  }
};


// 🔍 GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch {
    res.status(500).json({ message: "Invalid ID" });
  }
};


// ✏️ UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {

    // SKU CHECK
    if (req.body.sku) {
      const exist = await Product.findOne({ sku: req.body.sku });
      if (exist && exist._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    // BARCODE CHECK
    if (req.body.barcode) {
      const existBarcode = await Product.findOne({
        barcode: req.body.barcode,
      });

      if (existBarcode && existBarcode._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Barcode already exists" });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};


// ❌ DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
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
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      totalProducts: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      products,
    });

  } catch {
    res.status(500).json({ message: "Search failed" });
  }
};


// 🔥 BARCODE API (MOST IMPORTANT)
const getProductByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode?.trim();

    if (!barcode) {
      return res.status(400).json({
        message: "Barcode is required",
      });
    }

    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch {
    res.status(500).json({ message: "Barcode fetch failed" });
  }
};


// ⚠️ LOW STOCK
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lt: 10 },
    });

    res.json(products);

  } catch {
    res.status(500).json({ message: "Error fetching low stock" });
  }
};


// 📊 SALES REPORT
const getSalesByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    });

    const totalRevenue = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    res.json({
      date,
      totalOrders: orders.length,
      totalRevenue,
    });

  } catch {
    res.status(500).json({ message: "Report error" });
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