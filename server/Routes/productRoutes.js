const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/products/' });

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAvailableSizesByCategory,
  getAvailableColorsByCategory,
  getAvailableSizes,
  updateStock,
} = require('../controllers/productController');
const { handleVariationUploads } = require('../middlewares/upload');
const { getSubCategories, getAllParentCategories } = require('../controllers/categoryController');
const logRequest = require('../middlewares/log');

const router = express.Router();

// Basic CRUD routes


// Category-specific routes
router.get('/category/parent_category',logRequest,getAllParentCategories)
router.get('/category/subCategory/:parentCategoryId',getSubCategories)
router.get('/category/:category/sizes', getAvailableSizesByCategory);
router.get('/category/:category/colors', getAvailableColorsByCategory);
router.get('/category/:category', getProductsByCategory);
// Stock management routes
router.get('/sizes/available', getAvailableSizes); // Legacy route for specific product variation
router.patch('/:productId/stock', updateStock);


router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', handleVariationUploads, createProduct);
router.put('/:id', handleVariationUploads, updateProduct);
router.delete('/:id', deleteProduct);


module.exports = router;