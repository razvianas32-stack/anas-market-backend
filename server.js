require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ✅ Trust proxy (Render/Vercel ke liye important)
app.set("trust proxy", 1);

// ================= SECURITY =================
app.use(helmet());

// ================= CORS =================
app.use(cors({
  origin: [
    "http://localhost:3000",   // local frontend
    "https://anas-market-frontend-zcmh.vercel.app" // deployed frontend
  ],
  credentials: true
}));

// ================= RATE LIMIT =================
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.send("OK ✅");
});

// ================= HOME =================
app.get("/", (req, res) => {
  res.json({ message: "Backend chal raha hai 🚀" });
});

// ================= DATABASE CONNECT =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB Error ❌:", err.message);
    process.exit(1);
  }
};

// ================= DB CHECK MIDDLEWARE =================
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "DB not connected yet ⏳" });
  }
  next();
});

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/protected"));
app.use("/api/products", require("./routes/product"));

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("ERROR 👉", err.message);
  res.status(500).json({
    message: err.message || "Something went wrong ❌"
  });
});

// ================= SERVER START =================
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();