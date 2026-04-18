const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");
const validator = require("validator");

// ➕ Add product (protected)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required ❌" });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number ❌" });
    }

    // Sanitize inputs
    const sanitizedName = validator.escape(name);
    const sanitizedDescription = description ? validator.escape(description) : "";

    const product = new Product({
      name: sanitizedName,
      price,
      description: sanitizedDescription
    });

    await product.save();

    res.json({ message: "Product added ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📦 Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;