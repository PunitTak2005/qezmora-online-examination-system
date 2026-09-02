const Attempt = require('../models/Attempt');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Utility function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

exports.startAttempt = async (req, res, next) => {
  try {
    const { examId } = req.body;
    
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    if (exam.status !== 'published') return res.status(400).json({ success: false, message: 'Exam is not active' });

    // Check if an in-progress attempt already exists
    let attempt = await Attempt.findOne({ student: req.user.id, exam: examId, status: 'in-progress' })
      .populate('generatedQuestions.question', '-correctAnswer -explanation');

    if (attempt) {
      // Validate that all questions populated successfully (not stale/deleted question IDs)
      const hasStaleQuestions = attempt.generatedQuestions.some(g => !g.question);
      if (hasStaleQuestions) {
        console.warn(`⚠️ Stale attempt ${attempt._id} detected with missing questions. Re-generating fresh attempt...`);
        await Attempt.deleteOne({ _id: attempt._id });
        attempt = null;
      } else {
        const attemptObj = attempt.toObject();
        return res.status(200).json({ success: true, data: attemptObj });
      }
    }

    let selectedQuestions = [];

    if (exam.selectionMode === 'random' && exam.distributionRules?.length > 0) {
      // Fetch based on distribution rules
      for (const rule of exam.distributionRules) {
        const pool = await Question.find({
          category: rule.category,
          difficulty: rule.difficulty,
          status: 'active'
        });
        
        if (pool.length < rule.count) {
          return res.status(400).json({ success: false, message: `Insufficient questions in pool for category ${rule.category} (Difficulty: ${rule.difficulty}). Needed ${rule.count}, found ${pool.length}.` });
        }

        const shuffledPool = shuffleArray(pool);
        const selected = shuffledPool.slice(0, rule.count);
        selectedQuestions.push(...selected);
      }
    } else {
      // Standard fetch
      selectedQuestions = await Question.find({ exam: examId });
    }

    if (exam.shuffleQuestions) {
      selectedQuestions = shuffleArray(selectedQuestions);
    }

    const generatedQuestions = selectedQuestions.map(q => {
      let shuffledOptions = q.options ? [...q.options] : [];
      if (exam.shuffleOptions && q.type === 'mcq') {
        shuffledOptions = shuffleArray(shuffledOptions);
      }
      return {
        question: q._id,
        shuffledOptions
      };
    });

    attempt = await Attempt.create({
      student: req.user.id,
      exam: examId,
      status: 'in-progress',
      generatedQuestions
    });

    // Populate question text for the frontend
    attempt = await attempt.populate('generatedQuestions.question', '-correctAnswer -explanation');
    const attemptObj = attempt.toObject();

    res.status(201).json({ success: true, data: attemptObj });
  } catch (error) {
    next(error);
  }
};

exports.submitAttempt = async (req, res, next) => {
  try {
    const { attemptId, answers, timeTaken } = req.body;
    
    const attempt = await Attempt.findById(attemptId).populate('exam');
    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    if (attempt.status === 'submitted') return res.status(400).json({ success: false, message: 'Already submitted' });
    if (attempt.student.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    // We need to verify against original questions
    const questionIds = attempt.generatedQuestions.map(g => g.question);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    let score = 0;
    let totalMarks = 0;
    
    // Auto-grade based on the locked attempt questions
    attempt.answers = answers; // [{ questionId, selectedAnswer }]

    attempt.generatedQuestions.forEach(gq => {
      const q = questions.find(question => question._id.toString() === gq.question.toString());
      if (!q) return;

      totalMarks += q.marks;

      const studentAnswer = answers.find(a => a.questionId === gq.question.toString());
      if (!studentAnswer) return;

      if (q.type === 'mcq' || q.type === 'true-false') {
        if (q.correctAnswer === studentAnswer.selectedAnswer) score += q.marks;
      } else if (q.type === 'fill-blank' || q.type === 'short-answer') {
        if (q.correctAnswer.toLowerCase().trim() === studentAnswer.selectedAnswer.toLowerCase().trim()) {
          score += q.marks;
        }
      }
    });

    attempt.score = score;
    attempt.totalMarks = totalMarks;
    attempt.percentage = (score / totalMarks) * 100;
    attempt.passed = score >= attempt.exam.passingMarks;
    attempt.timeTaken = timeTaken || 0;
    attempt.status = 'submitted';
    attempt.submittedAt = Date.now();

    await attempt.save();

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttempts = async (req, res, next) => {
  try {
    const { status, subject, search, sort = '-submittedAt', page = 1, limit = 10 } = req.query;

    const query = { student: req.user.id };

    if (status === 'passed') query.passed = true;
    if (status === 'failed') query.passed = false;
    
    // For subject and search filtering, it's better to filter after populate or use an aggregation.
    // To keep it simple and efficient, we can lookup the Exam.
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;

    let attempts = await Attempt.find(query)
      .populate('exam', 'title subject duration totalMarks passingMarks')
      .sort(sort)
      .lean();

    // Client-side filtering for populated fields (since search/subject are on Exam)
    if (search) {
      const lowerSearch = search.toLowerCase();
      attempts = attempts.filter(a => a.exam && a.exam.title && a.exam.title.toLowerCase().includes(lowerSearch));
    }
    if (subject) {
      attempts = attempts.filter(a => a.exam && a.exam.subject === subject);
    }

    const total = attempts.length;
    
    // Pagination slice
    const paginatedAttempts = attempts.slice(startIndex, startIndex + limitNum);

    res.status(200).json({ 
      success: true, 
      count: paginatedAttempts.length, 
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: paginatedAttempts 
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttemptById = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('exam')
      .populate('student', 'name email');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Security check: only student who took it, or teacher/admin can view
    if (attempt.student._id.toString() !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const questions = await Question.find({ exam: attempt.exam._id });

    // Combine attempt answers with original questions
    const detailedAnswers = attempt.answers.map(ans => {
      const q = questions.find(q => q._id.toString() === ans.questionId.toString());
      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        questionText: q ? q.question : 'Question removed',
        correctAnswer: q ? q.correctAnswer : 'N/A',
        marks: q ? q.marks : 0,
        type: q ? q.type : 'N/A',
        options: q ? q.options : [],
        explanation: q ? q.explanation : '',
      };
    });

    res.status(200).json({ 
      success: true, 
      data: {
        ...attempt.toObject(),
        detailedAnswers
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getExamAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ exam: req.params.examId })
      .populate('student', 'name email college')
      .sort('-submittedAt');

    res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (error) {
    next(error);
  }
};

exports.getAttemptStats = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ student: req.user.id });
    
    let totalScore = 0;
    let bestScore = 0;
    let passCount = 0;
    
    attempts.forEach(a => {
      totalScore += a.percentage;
      if (a.percentage > bestScore) bestScore = a.percentage;
      if (a.passed) passCount++;
    });
    
    const avgScore = attempts.length > 0 ? (totalScore / attempts.length).toFixed(2) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalAttempts: attempts.length,
        avgScore: Number(avgScore),
        bestScore,
        passCount
      }
    });
  } catch (error) {
    next(error);
  }
};
