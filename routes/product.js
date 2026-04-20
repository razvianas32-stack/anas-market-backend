const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");
const validator = require("validator");

// ➕ Add product (protected)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const numericPrice = Number(price);

    if (!name || !numericPrice) {
      return res.status(400).json({ message: "Name and price required ❌" });
    }

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number ❌" });
    }

    const sanitizedName = validator.escape(name);
    const sanitizedDescription = description ? validator.escape(description) : "";

    const product = new Product({
      name: sanitizedName,
      price: numericPrice,
      description: sanitizedDescription
    });

    await product.save();

    res.json({ message: "Product added ✅" });

  } catch (err) {
    console.log("ADD ERROR:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📦 Get all products
router.get("/", async (req, res) => {
  try {
    console.log("Fetching products...");

    const products = await Product.find().lean();

    res.json(products);

  } catch (err) {
    console.error("🔥 REAL ERROR:", err);
    res.status(500).json({ error: err.message }); // 👈 CHANGE
  }
});

module.exports = router;