const express = require('express');
const {
  submitAttempt,
  startAttempt,
  getStudentAttempts,
  getAttemptById,
  getExamAttempts,
  getAttemptStats
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');
const { isAdminOrTeacher } = require('../middleware/roleCheck');

const router = express.Router();

router.post('/start', protect, startAttempt);
router.post('/submit', protect, submitAttempt); // Changed to /submit

router.get('/my-attempts', protect, getStudentAttempts);
router.get('/stats', protect, getAttemptStats);
router.get('/:id', protect, getAttemptById);
router.get('/exam/:examId', protect, isAdminOrTeacher, getExamAttempts);

module.exports = router;
