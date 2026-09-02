const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

dotenv.config({ path: './.env' });

const testQuantumAttempt = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('🧪 Testing Quantum Exam Attempt Data Generation...');

    const exam = await Exam.findOne({ title: "Advanced Quantum Computing & Algorithms" });
    if (!exam) {
      console.error('❌ Quantum exam not found!');
      process.exit(1);
    }
    console.log(`📌 Found Quantum Exam ID: ${exam._id}`);

    const student = await User.findOne({ role: 'student' }) || await User.findOne({ role: 'admin' });
    
    // Simulate what attemptController.startAttempt does
    let attempt = await Attempt.findOne({ student: student._id, exam: exam._id, status: 'in-progress' })
      .populate('generatedQuestions.question', '-correctAnswer -explanation');

    if (!attempt) {
      const selectedQuestions = await Question.find({ exam: exam._id });
      const generatedQuestions = selectedQuestions.map(q => ({
        question: q._id,
        shuffledOptions: q.options ? [...q.options] : []
      }));

      attempt = await Attempt.create({
        student: student._id,
        exam: exam._id,
        status: 'in-progress',
        generatedQuestions
      });

      attempt = await attempt.populate('generatedQuestions.question', '-correctAnswer -explanation');
    }

    const attemptObj = attempt.toObject ? attempt.toObject() : attempt;

    console.log(`✅ Attempt ID: ${attemptObj._id}`);
    console.log(`✅ Generated Questions Count: ${attemptObj.generatedQuestions?.length}`);

    // Verify first 3 questions mapping
    const sampleFormatted = (attemptObj.generatedQuestions || []).slice(0, 3).map((g, i) => {
      const qDoc = (g.question && typeof g.question === 'object') ? (g.question._doc || g.question) : {};
      return {
        index: i + 1,
        questionText: qDoc.question || qDoc.questionText || qDoc.title || qDoc.text || 'MISSING',
        optionsCount: (g.shuffledOptions?.length || qDoc.options?.length || 0)
      };
    });

    console.log('\n📄 Sample Question Payload sent to Frontend:');
    console.log(JSON.stringify(sampleFormatted, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
};

testQuantumAttempt();
