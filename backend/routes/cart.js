const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's cart
router.get("/", auth, async (req, res) => {
  const cart = await Cart.findAll({ where: { UserId: req.user }, include: Product });
  res.json(cart);
});

// Add item
router.post("/", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const cartItem = await Cart.create({ UserId: req.user, ProductId: productId, quantity });
  res.json(cartItem);
});

// Remove item
router.delete("/:id", auth, async (req, res) => {
  await Cart.destroy({ where: { id: req.params.id, UserId: req.user } });
  res.json({ msg: "Deleted" });
});

module.exports = router;