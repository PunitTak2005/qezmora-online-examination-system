const express = require('express');
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, isAdmin, createCategory);

router
  .route('/:id')
  .put(protect, isAdmin, updateCategory)
  .delete(protect, isAdmin, deleteCategory);

router
  .route('/slug/:slug')
  .get(getCategoryBySlug);

module.exports = router;
