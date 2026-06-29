const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const { body, validationResult } = require("express-validator");

// Validation Rules
const validateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
];

// ======================================
// CREATE Product (POST)
// ======================================
router.post("/", validateProduct, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================================
// READ All Products (GET)
// ======================================
router.get("/", async (req, res) => {

  try {
    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================================
// READ Single Product (GET by ID)
// ======================================
router.get("/:id", async (req, res) => {

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================================
// UPDATE Product (PUT)
// ======================================
router.put("/:id", validateProduct, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(updatedProduct);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================================
// DELETE Product (DELETE)
// ======================================
router.delete("/:id", async (req, res) => {

  try {

    const deletedProduct = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;