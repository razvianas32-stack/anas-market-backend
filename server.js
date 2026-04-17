require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// 🔗 MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/anas-market")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error:", err));

// middleware
app.use(cors());
app.use(express.json());

// 📦 Schema + Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const Product = mongoose.model("Product", productSchema);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("Backend chal raha hai 🚀");
});

// 📦 GET all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error fetching products ❌");
  }
});

// ➕ ADD product
app.post("/products", async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).send("All fields are required ❌");
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      image
    });

    await newProduct.save();

    res.json({
      message: "Product saved in DB ✅",
      product: newProduct
    });

  } catch (err) {
    res.status(500).send("Error saving product ❌");
  }
});

// ❌ DELETE product (by ID 🔥)
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Product deleted ✅");
  } catch (err) {
    res.status(500).send("Delete error ❌");
  }
});
const authRoutes = require("./routes/auth");
console.log("AuthRoutes:", authRoutes);
app.use("/api/auth", authRoutes);

const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);

const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);

// 🚀 Server start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});