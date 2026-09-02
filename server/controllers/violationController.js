const ExamViolation = require('../models/ExamViolation');
const Attempt = require('../models/Attempt');
const Exam = require('../models/Exam');
const User = require('../models/User');

// @desc    Log a new exam violation
// @route   POST /api/violations
// @access  Private (Student/Authenticated)
exports.createViolation = async (req, res, next) => {
  try {
    const { examId, attemptId, type, warningNumber, metadata } = req.body;

    if (!examId || !type) {
      return res.status(400).json({ success: false, message: 'Exam ID and violation type are required' });
    }

    const violation = await ExamViolation.create({
      exam: examId,
      student: req.user.id,
      attempt: attemptId || undefined,
      type,
      warningNumber: warningNumber || 1,
      metadata: metadata || { userAgent: req.headers['user-agent'] }
    });

    res.status(201).json({
      success: true,
      message: 'Violation logged',
      data: violation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exam violations (Admin)
// @route   GET /api/violations
// @access  Private/Admin
exports.getViolations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, exam, type, student, search } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = {};

    if (exam) query.exam = exam;
    if (type && type !== 'All') query.type = type;
    if (student) query.student = student;

    // Search by student name/email
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const userIds = users.map(u => u._id);
      query.student = { $in: userIds };
    }

    const total = await ExamViolation.countDocuments(query);

    const violations = await ExamViolation.find(query)
      .populate('student', 'name email role')
      .populate('exam', 'title subject difficulty')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: violations.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: violations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get violation stats for Admin Integrity Dashboard
// @route   GET /api/violations/stats
// @access  Private/Admin
exports.getViolationStats = async (req, res, next) => {
  try {
    const totalViolations = await ExamViolation.countDocuments();
    const fullscreenExits = await ExamViolation.countDocuments({ type: 'fullscreen_exit' });
    const tabSwitches = await ExamViolation.countDocuments({ type: 'tab_switch' });
    const windowBlurs = await ExamViolation.countDocuments({ type: 'window_blur' });
    const copyPasteAttempts = await ExamViolation.countDocuments({ type: 'copy_paste_attempt' });

    // Count attempts where warningNumber >= 3 (Auto-submitted)
    const autoSubmittedCount = await ExamViolation.distinct('attempt', { warningNumber: { $gte: 3 } });

    res.status(200).json({
      success: true,
      data: {
        totalViolations,
        fullscreenExits,
        tabSwitches,
        windowBlurs,
        copyPasteAttempts,
        autoSubmittedCount: autoSubmittedCount.length
      }
    });
  } catch (error) {
    next(error);
  }
};
