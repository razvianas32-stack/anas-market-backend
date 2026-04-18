const express = require("express");
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// ✅ Validation functions
const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required ❌" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format ❌" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters with uppercase, lowercase, and number ❌" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      message: "Signup successful ✅"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required ❌" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format ❌" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Wrong password ❌" });

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "1d"
    });

    res.json({
      message: "Login success ✅",
      token: token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;