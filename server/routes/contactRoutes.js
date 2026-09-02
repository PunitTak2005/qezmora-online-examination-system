const express = require('express');
const {
  createContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage,
  getContactStats
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Public submission
router.post('/', createContactMessage);

// Admin-only endpoints
router.get('/stats', protect, isAdmin, getContactStats);
router.get('/', protect, isAdmin, getAllContactMessages);
router.patch('/:id', protect, isAdmin, updateContactStatus);
router.delete('/:id', protect, isAdmin, deleteContactMessage);

module.exports = router;
