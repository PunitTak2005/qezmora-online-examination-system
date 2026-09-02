const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

exports.getPublicExams = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    let query = Exam.find({ status: 'published' })
      .populate('teacher', 'name email')
      .populate('category', 'name slug icon color')
      .sort('-createdAt')
      .lean();
      
    if (limit) {
      query = query.limit(limit);
    }

    const exams = await query;
      
    const examsWithCounts = await Promise.all(
      exams.map(async (exam) => {
        const count = await Question.countDocuments({ exam: exam._id });
        return { ...exam, questionCount: count || exam.totalMarks };
      })
    );

    res.status(200).json({ success: true, count: examsWithCounts.length, data: examsWithCounts });
  } catch (error) {
    next(error);
  }
};

exports.getExams = async (req, res, next) => {
  try {
    const { subject, difficulty, status, search, category } = req.query;
    let query = {};

    if (subject && subject !== 'All') {
      query.subject = { $regex: new RegExp(`^${subject}$`, 'i') };
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
    }
    if (category && category !== 'All') {
      query.subject = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    if (req.user && req.user.role === 'student') {
      query.status = 'published';
    } else if (req.user && req.user.role === 'teacher') {
      query.teacher = req.user._id;
      if (status) query.status = status;
    } else if (req.user && req.user.role === 'admin') {
      if (status) query.status = status;
    } else {
      // Unauthenticated / guest public listing
      query.status = 'published';
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const exams = await Exam.find(query)
      .populate('teacher', 'name email')
      .populate('category', 'name slug icon color')
      .sort('-createdAt')
      .lean();

    const examsWithCounts = await Promise.all(
      exams.map(async (exam) => {
        const count = await Question.countDocuments({ exam: exam._id });
        return { ...exam, questionCount: count || exam.totalMarks };
      })
    );

    res.status(200).json({ success: true, count: examsWithCounts.length, data: examsWithCounts });
  } catch (error) {
    next(error);
  }
};

exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('teacher', 'name email');
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // Add question count
    const questionCount = await Question.countDocuments({ exam: req.params.id });

    // Restrict access for students to only published exams
    if (req.user.role === 'student' && exam.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ 
      success: true, 
      data: { ...exam.toObject(), questionCount } 
    });
  } catch (error) {
    next(error);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    // Inject the logged-in user as the teacher
    req.body.teacher = req.user.id;
    
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // Ensure only the owner teacher or admin can update
    if (exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this exam' });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this exam' });
    }

    // Also delete associated questions and attempts
    await Question.deleteMany({ exam: req.params.id });
    await Attempt.deleteMany({ exam: req.params.id });
    
    await exam.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.publishExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    exam.status = 'published';
    await exam.save();

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.closeExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    exam.status = 'closed';
    await exam.save();

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.getTeacherExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ teacher: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    next(error);
  }
};

exports.getExamStats = async (req, res, next) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const attempts = await Attempt.find({ exam: examId });
    
    const totalAttempts = attempts.length;
    let passCount = 0;
    let totalScore = 0;
    let maxScore = 0;
    let minScore = exam.totalMarks;

    attempts.forEach((attempt) => {
      if (attempt.passed) passCount++;
      totalScore += attempt.score;
      if (attempt.score > maxScore) maxScore = attempt.score;
      if (attempt.score < minScore) minScore = attempt.score;
    });

    const avgScore = totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(2) : 0;
    const passRate = totalAttempts > 0 ? ((passCount / totalAttempts) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        passCount,
        passRate: Number(passRate),
        avgScore: Number(avgScore),
        highestScore: totalAttempts > 0 ? maxScore : 0,
        lowestScore: totalAttempts > 0 ? minScore : 0,
      }
    });
  } catch (error) {
    next(error);
  }
};
