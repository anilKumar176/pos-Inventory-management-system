const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//  GENERATE TOKEN
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

//
// ================= REGISTER USER =================
//
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "admin", //  FIXED
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// ================= LOGIN USER =================
//
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }

  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// ================= CREATE USER (ADMIN) =================
//
const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "admin" ? "admin" : "cashier",
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.log("CREATE USER ERROR:", error.message);

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

//
// ================= GET ALL USERS =================
//
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    console.log("GET USERS ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// ================= DELETE USER =================
//
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log("DELETE ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};
//manage getuser

const getUserCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.json({ totalUsers });

  } catch (error) {
    console.log("COUNT ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createUserByAdmin,
  getAllUsers,
  deleteUser,
  getUserCount,
};