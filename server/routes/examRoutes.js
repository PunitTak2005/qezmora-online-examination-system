const express = require('express');
const {
  getPublicExams,
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  closeExam,
  getTeacherExams,
  getExamStats
} = require('../controllers/examController');
const { protect, optionalProtect } = require('../middleware/auth');
const { isAdminOrTeacher, isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Public route for landing page & all catalog
router.get('/public', getPublicExams);
router.get('/all', optionalProtect, getExams);

router.get('/teacher', protect, isAdminOrTeacher, getTeacherExams);

router
  .route('/')
  .get(optionalProtect, getExams)
  .post(protect, isAdminOrTeacher, createExam);

router
  .route('/:id')
  .get(protect, getExam)
  .put(protect, isAdminOrTeacher, updateExam)
  .delete(protect, isAdminOrTeacher, deleteExam);

router.put('/:id/publish', protect, isAdminOrTeacher, publishExam);
router.put('/:id/close', protect, isAdminOrTeacher, closeExam);
router.get('/:id/stats', protect, isAdminOrTeacher, getExamStats);

module.exports = router;
