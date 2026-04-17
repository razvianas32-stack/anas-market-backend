const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protected route
router.get("/dashboard", authMiddleware, (req, res) => {
  res.send("Welcome to dashboard 🔥 User ID: " + req.user.id);
});

module.exports = router;