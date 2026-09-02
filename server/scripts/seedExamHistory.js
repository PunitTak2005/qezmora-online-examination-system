const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

const seedExamHistory = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB successfully!\n');

    // 1. Fetch Students & Exams
    const students = await User.find({ role: 'student' });
    if (students.length === 0) {
      console.log('❌ No students found in database. Run main seeder first.');
      process.exit(1);
    }

    const exams = await Exam.find({ status: 'published' });
    if (exams.length === 0) {
      console.log('❌ No published exams found in database. Run main seeder first.');
      process.exit(1);
    }

    console.log(`✓ Found ${students.length} student users`);
    console.log(`✓ Found ${exams.length} published exams\n`);

    // 2. Fetch Questions grouped by Exam
    const questionsByExam = {};
    for (const exam of exams) {
      const qList = await Question.find({ exam: exam._id });
      questionsByExam[exam._id.toString()] = qList;
    }

    // 3. Generate 100 Realistic Completed Exam Attempts
    console.log('📝 Generating realistic student exam attempts...');
    
    // Clear previously seeded historical attempts (identified by isSeed: true tag)
    await Attempt.deleteMany({ isSeedHistory: true });

    const attemptsToInsert = [];
    const targetAttemptCount = 100;
    const now = new Date();

    // Natural distribution weights: 25% Excellent, 40% Good, 25% Average, 10% Below Pass
    const getGradePercentage = () => {
      const rand = Math.random();
      if (rand < 0.25) {
        // Excellent: 90 - 100%
        return Math.floor(Math.random() * 11) + 90;
      } else if (rand < 0.65) {
        // Good: 75 - 89%
        return Math.floor(Math.random() * 15) + 75;
      } else if (rand < 0.90) {
        // Average: 55 - 74%
        return Math.floor(Math.random() * 20) + 55;
      } else {
        // Below Pass: 35 - 54%
        return Math.floor(Math.random() * 20) + 35;
      }
    };

    for (let i = 0; i < targetAttemptCount; i++) {
      // Pick random student & random exam
      const student = students[i % students.length];
      const exam = exams[Math.floor(Math.random() * exams.length)];
      const examQuestions = questionsByExam[exam._id.toString()] || [];

      const totalMarks = exam.totalMarks || 100;
      const targetPct = getGradePercentage();
      const score = Math.round((targetPct / 100) * totalMarks);
      const percentage = Math.round((score / totalMarks) * 100);
      const passed = score >= (exam.passingMarks || 40);

      // Realistic time taken in seconds (between 40% and 95% of total exam duration)
      const durationSecs = (exam.duration || 60) * 60;
      const minSecs = Math.floor(durationSecs * 0.4);
      const maxSecs = Math.floor(durationSecs * 0.95);
      const timeTaken = Math.floor(Math.random() * (maxSecs - minSecs + 1)) + minSecs;

      // Realistic submittedAt date spread over past 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minsAgo = Math.floor(Math.random() * 60);
      
      const submittedAt = new Date(now);
      submittedAt.setDate(submittedAt.getDate() - daysAgo);
      submittedAt.setHours(submittedAt.getHours() - hoursAgo, submittedAt.getMinutes() - minsAgo);

      const startedAt = new Date(submittedAt.getTime() - timeTaken * 1000);

      // Build answers array matching question IDs
      const answers = examQuestions.map(q => ({
        questionId: q._id,
        selectedAnswer: q.correctAnswer || (q.options && q.options[0]) || 'Option A'
      }));

      attemptsToInsert.push({
        student: student._id,
        exam: exam._id,
        answers,
        status: 'submitted',
        score,
        totalMarks,
        percentage,
        passed,
        timeTaken,
        submittedAt,
        createdAt: startedAt,
        updatedAt: submittedAt,
        isSeedHistory: true
      });
    }

    // Sort by submittedAt ascending so performance graphs line up chronologically
    attemptsToInsert.sort((a, b) => a.submittedAt - b.submittedAt);

    await Attempt.insertMany(attemptsToInsert);

    const totalInDb = await Attempt.countDocuments();

    console.log(`✓ Created ${attemptsToInsert.length} exam attempts`);
    console.log(`✓ Total Exam Attempts in Database: ${totalInDb}`);
    console.log('✓ Performance data & analytics trends updated');
    console.log('✓ Student History seeded successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding exam history:', error);
    process.exit(1);
  }
};

seedExamHistory();
