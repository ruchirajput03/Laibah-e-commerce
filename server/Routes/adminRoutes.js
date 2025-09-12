const express = require('express');
const { login, getDashboardStats, fetchAllUsers } = require('../controllers/authController');

const { getAllCategories, getAllParentCategories, getCategoryById, getCategoryHierarchy, getSubCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { uploadCategoryImage } = require('../middlewares/upload');

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/dashboard-stats', getDashboardStats);
router.get("/users", fetchAllUsers);

// Category routes
router.get('/categories', getAllCategories);
router.get('/categories/parents', getAllParentCategories);
router.get('/categories/:id', getCategoryById);
router.get('/categories/:id/hierarchy', getCategoryHierarchy);
router.get('/categories/:parentId/subcategories', getSubCategories);
router.post('/categories', uploadCategoryImage, createCategory);
router.put('/categories/:id', uploadCategoryImage, updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;