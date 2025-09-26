const validator = require("validator");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // keep validations
  if (!email || !password) {
    return res.status(400).json({ msg: "Email & password required" });
  }

  try {
    // check user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // 👇 only save email, password
    // isAdmin gets default false (from model)
    const user = await User.create({ email, password: hashed });

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Invalid password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Get all users (Admins only)
router.get("/users", auth, adminOnly, async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "email", "isAdmin", "createdAt"]
  });
  res.json(users);
});

// Delete user (Admins only)
router.delete("/user/:id", auth, adminOnly, async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ msg: "User not found" });
  res.json({ msg: "User deleted successfully" });
});
module.exports = router;