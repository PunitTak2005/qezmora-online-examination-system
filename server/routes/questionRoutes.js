const express = require('express');
const {
  getQuestionsByExam,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { isAdminOrTeacher } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/exam/:examId', protect, getQuestionsByExam);

router
  .route('/')
  .post(protect, isAdminOrTeacher, createQuestion);

router
  .route('/:id')
  .get(protect, getQuestion)
  .put(protect, isAdminOrTeacher, updateQuestion)
  .delete(protect, isAdminOrTeacher, deleteQuestion);

router.post('/bulk', protect, isAdminOrTeacher, bulkCreateQuestions);

module.exports = router;
