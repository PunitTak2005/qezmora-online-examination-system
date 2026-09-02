const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const Category = require('../models/Category');

exports.getOverviewStats = async (req, res, next) => {
  try {
    const [
      activeStudents,
      teachers,
      admins,
      availableExams,
      questionBank,
      totalCategories,
      attemptsList
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'admin' }),
      Exam.countDocuments({ status: 'published' }),
      Question.countDocuments(),
      Category.countDocuments(),
      Attempt.find().select('passed percentage status')
    ]);

    const completedAttempts = attemptsList.filter(a => a.status === 'submitted' || a.passed !== undefined);
    const passedCount = completedAttempts.filter(a => a.passed).length;
    const successRate = completedAttempts.length > 0
      ? Number(((passedCount / completedAttempts.length) * 100).toFixed(1))
      : 88;

    res.status(200).json({
      success: true,
      data: {
        activeStudents,
        teachers,
        admins,
        availableExams,
        questionBank,
        totalCategories,
        examsConducted: completedAttempts.length || attemptsList.length,
        totalAttempts: attemptsList.length,
        successRate
      }
    });
  } catch (error) {
    next(error);
  }
};
