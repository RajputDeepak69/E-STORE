const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// Add product
router.post("/", async (req, res) => {
  const { name, price, imageUrl } = req.body;
  const product = await Product.create({ name, price, imageUrl });
  res.json(product);
});
// Delete product by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;