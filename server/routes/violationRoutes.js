const express = require('express');
const { createViolation, getViolations, getViolationStats } = require('../controllers/violationController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', protect, createViolation);
router.get('/', protect, isAdmin, getViolations);
router.get('/stats', protect, isAdmin, getViolationStats);

module.exports = router;
