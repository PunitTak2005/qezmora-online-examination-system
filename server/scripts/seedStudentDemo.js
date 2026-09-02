const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

// Realistic attempts timeline relative to current date
const studentExamsConfig = [
  { title: 'React Fundamentals', category: 'Programming', score: 94, timeTakenMinutes: 38, daysAgo: 0, hour: 9, min: 45 },
  { title: 'JavaScript Essentials', category: 'Programming', score: 91, timeTakenMinutes: 27, daysAgo: 1, hour: 18, min: 20 },
  { title: 'Python Programming', category: 'Programming', score: 88, timeTakenMinutes: 49, daysAgo: 3, hour: 14, min: 10 },
  { title: 'Full Stack Web Development Assessment', category: 'Programming', score: 86, timeTakenMinutes: 52, daysAgo: 7, hour: 11, min: 30 },
  { title: 'Algebra Mastery', category: 'Mathematics', score: 82, timeTakenMinutes: 25, daysAgo: 13, hour: 16, min: 45 },
  { title: 'Calculus Challenge', category: 'Mathematics', score: 78, timeTakenMinutes: 42, daysAgo: 21, hour: 10, min: 15 },
  { title: 'Physics Concepts', category: 'Science', score: 84, timeTakenMinutes: 35, daysAgo: 36, hour: 15, min: 20 },
  { title: 'Chemistry Fundamentals', category: 'Science', score: 89, timeTakenMinutes: 29, daysAgo: 46, hour: 13, min: 0 },
  { title: 'Biology Essentials', category: 'Science', score: 92, timeTakenMinutes: 31, daysAgo: 54, hour: 17, min: 30 },
  { title: 'English Grammar', category: 'English', score: 95, timeTakenMinutes: 18, daysAgo: 65, hour: 11, min: 0 },
  { title: 'Reading Comprehension', category: 'English', score: 90, timeTakenMinutes: 22, daysAgo: 75, hour: 14, min: 15 },
  { title: 'Quantitative Aptitude', category: 'Aptitude', score: 87, timeTakenMinutes: 31, daysAgo: 85, hour: 10, min: 45 },
  { title: 'Logical Reasoning', category: 'Aptitude', score: 91, timeTakenMinutes: 24, daysAgo: 95, hour: 16, min: 0 },
  { title: 'Current Affairs', category: 'General Knowledge', score: 85, timeTakenMinutes: 28, daysAgo: 105, hour: 12, min: 30 },
  { title: 'Indian Constitution', category: 'General Knowledge', score: 88, timeTakenMinutes: 30, daysAgo: 115, hour: 15, min: 10 }
];

const seedStudentDemo = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // 1. Find or Update student@exam.com
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const studentDoc = {
      name: 'Rahul Verma',
      email: 'student@exam.com',
      password: hashedPassword,
      role: 'student',
      college: 'Techno NJR Institute of Technology',
      course: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
      bio: 'Senior Computer Science student at Techno NJR Institute of Technology specializing in Web Engineering, Systems Architecture & Algorithms.'
    };

    const student = await User.findOneAndUpdate(
      { email: 'student@exam.com' },
      studentDoc,
      { upsert: true, new: true }
    );
    console.log('✓ Updated student@exam.com');

    // 2. Fetch Published Exams
    const allExams = await Exam.find({ status: 'published' });
    if (allExams.length === 0) {
      console.log('❌ No published exams found in database.');
      process.exit(1);
    }

    // Clear previous attempts for student@exam.com
    await Attempt.deleteMany({ student: student._id });

    // 3. Create 15 Completed Attempts with Realistic Timestamps
    const attemptsToInsert = [];
    const now = new Date();

    for (let i = 0; i < studentExamsConfig.length; i++) {
      const cfg = studentExamsConfig[i];
      
      let exam = allExams.find(e => e.title.toLowerCase().includes(cfg.title.toLowerCase())) || allExams[i % allExams.length];
      const examQuestions = await Question.find({ exam: exam._id });

      const totalMarks = exam.totalMarks || 100;
      const score = Math.round((cfg.score / 100) * totalMarks);
      const percentage = Math.round((score / totalMarks) * 100);
      const passed = score >= (exam.passingMarks || 40);
      const timeTaken = cfg.timeTakenMinutes * 60;

      const submittedAt = new Date(now);
      submittedAt.setDate(submittedAt.getDate() - cfg.daysAgo);
      submittedAt.setHours(cfg.hour, cfg.min, 0, 0);

      const startedAt = new Date(submittedAt.getTime() - timeTaken * 1000);

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
        startedAt,
        createdAt: startedAt,
        updatedAt: submittedAt,
        isStudentDemo: true
      });
    }

    // Sort chronologically newest first
    attemptsToInsert.sort((a, b) => b.submittedAt - a.submittedAt);

    await Attempt.insertMany(attemptsToInsert);
    console.log(`✓ Linked ${attemptsToInsert.length} exam attempts with realistic dynamic timestamps`);

    console.log('✓ Dashboard statistics generated');
    console.log('✓ Leaderboard updated');
    console.log('✓ Seed completed successfully\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seedStudentDemo:', error);
    process.exit(1);
  }
};

seedStudentDemo();
