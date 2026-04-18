require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ✅ Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." }
});
app.use(limiter);

// ✅ Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔗 MongoDB Atlas connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error:", err));

// 🏠 Home route
app.get("/", (req, res) => {
  res.json({ message: "Backend chal raha hai 🚀" });
});

// 🔐 Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);

const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong! ❌" });
});

// ✅ 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// 🚀 Server start (Render compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});