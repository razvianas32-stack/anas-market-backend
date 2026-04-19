require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ✅ Security
app.use(helmet());

// ✅ CORS
app.use(cors({
  origin: "https://anas-market-frontend-zcmh.vercel.app",
  credentials: true
}));

// ✅ Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 SINGLE MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => {
  console.error("MongoDB Error ❌:", err.message);
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// 🏠 Home
app.get("/", (req, res) => {
  res.json({ message: "Backend chal raha hai 🚀" });
});

// 🔐 Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/protected"));
app.use("/api/products", require("./routes/product"));

// ❌ 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// ❌ Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Something went wrong ❌" });
});

// 🚀 Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});