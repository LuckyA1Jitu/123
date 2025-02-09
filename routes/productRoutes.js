import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import path from 'path';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Found products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    console.log('Received file:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: `/uploads/${req.file.filename}`,
      stock: req.body.stock
    });

    const savedProduct = await product.save();
    console.log('Saved product:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    console.log('Attempting to delete product:', req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    console.log('Product deleted successfully');
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/products/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in GET /api/products/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router; 