const Question = require('../models/Question');
const Exam = require('../models/Exam');

exports.getQuestionsByExam = async (req, res, next) => {
  try {
    const examId = req.params.examId;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    let questions = await Question.find({ exam: examId });

    // If student, remove correct answers and explanations
    if (req.user.role === 'student') {
      questions = questions.map(q => {
        const questionObj = q.toObject();
        delete questionObj.correctAnswer;
        delete questionObj.explanation;
        return questionObj;
      });
    }

    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const examId = req.body.exam;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const question = await Question.create(req.body);

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id).populate('exam');

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (question.exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('exam');

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (question.exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await question.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateQuestions = async (req, res, next) => {
  try {
    const { examId, questions } = req.body;
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const questionsWithExam = questions.map(q => ({
      ...q,
      exam: examId
    }));

    const createdQuestions = await Question.insertMany(questionsWithExam);

    res.status(201).json({ success: true, count: createdQuestions.length, data: createdQuestions });
  } catch (error) {
    next(error);
  }
};
