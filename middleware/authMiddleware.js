const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // ❌ agar header nahi hai
  if (!authHeader) {
    return res.status(401).json({ message: "No token, access denied ❌" });
  }

  // 🔥 "Bearer TOKEN" se sirf TOKEN nikaalo
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token format wrong ❌" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token ❌" });
  }
}

module.exports = authMiddleware;