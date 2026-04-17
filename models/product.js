const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
});

// 🔥 FIX
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);