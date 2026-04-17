const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

// ➕ Add product (protected)
router.post("/add", authMiddleware, async (req, res) => {
  const { name, price, description } = req.body;

  const product = new Product({
    name,
    price,
    description
  });

  await product.save();

  res.send("Product added ✅");
});

// 📦 Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;