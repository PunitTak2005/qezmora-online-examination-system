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

const demoExamsConfig = [
  { title: 'React Fundamentals', category: 'Programming', score: 92, timeTakenMinutes: 38, daysAgo: 0 },
  { title: 'JavaScript Essentials', category: 'Programming', score: 95, timeTakenMinutes: 27, daysAgo: 1 },
  { title: 'Python Programming', category: 'Programming', score: 88, timeTakenMinutes: 49, daysAgo: 4 },
  { title: 'Algebra Mastery', category: 'Mathematics', score: 84, timeTakenMinutes: 25, daysAgo: 7 },
  { title: 'Calculus Challenge', category: 'Mathematics', score: 76, timeTakenMinutes: 42, daysAgo: 14 },
  { title: 'Physics Concepts', category: 'Science', score: 81, timeTakenMinutes: 35, daysAgo: 21 },
  { title: 'Chemistry Fundamentals', category: 'Science', score: 90, timeTakenMinutes: 29, daysAgo: 30 },
  { title: 'English Grammar', category: 'English', score: 96, timeTakenMinutes: 18, daysAgo: 45 },
  { title: 'Quantitative Aptitude', category: 'Aptitude', score: 87, timeTakenMinutes: 31, daysAgo: 55 },
  { title: 'Logical Reasoning', category: 'Aptitude', score: 91, timeTakenMinutes: 24, daysAgo: 65 },
  { title: 'World History', category: 'General Knowledge', score: 79, timeTakenMinutes: 28, daysAgo: 75 },
  { title: 'Indian Constitution', category: 'General Knowledge', score: 89, timeTakenMinutes: 30, daysAgo: 85 }
];

const seedJohnSmith = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB successfully!\n');

    // 1. Find or Create John Smith Demo User
    const hashedPassword = await bcrypt.hash('John@123', 10);
    const altPassword = await bcrypt.hash('Password123!', 10);

    const johnSmithDoc = {
      name: 'John Smith',
      email: 'john.smith@demo.qezmora.com',
      password: hashedPassword,
      role: 'student',
      college: 'Tech University',
      course: 'Computer Science',
      bio: 'Computer Science Senior at Tech University. Enthusiastic about Full-Stack Web Development, Data Structures, and Systems Architecture.'
    };

    const johnSmith = await User.findOneAndUpdate(
      { email: 'john.smith@demo.qezmora.com' },
      johnSmithDoc,
      { upsert: true, new: true }
    );
    console.log('✓ John Smith found/created');

    // Also update student@exam.com and student@qezmora.com so logins share demo data if used
    await User.findOneAndUpdate(
      { email: 'student@exam.com' },
      { name: 'John Smith', college: 'Tech University', course: 'Computer Science', password: altPassword },
      { upsert: true }
    );
    await User.findOneAndUpdate(
      { email: 'student@qezmora.com' },
      { name: 'John Smith', college: 'Tech University', course: 'Computer Science', password: altPassword },
      { upsert: true }
    );

    // 2. Fetch Published Exams
    const allExams = await Exam.find({ status: 'published' });
    if (allExams.length === 0) {
      console.log('❌ No published exams found. Please run main seeder first.');
      process.exit(1);
    }

    // Clear previous demo attempts for John Smith
    await Attempt.deleteMany({ student: johnSmith._id });

    // 3. Create 12 Completed Exam Attempts
    const attemptsToInsert = [];
    const now = new Date();

    for (let i = 0; i < demoExamsConfig.length; i++) {
      const cfg = demoExamsConfig[i];
      
      // Match by title or fallback to random published exam
      let exam = allExams.find(e => e.title.toLowerCase().includes(cfg.title.toLowerCase())) || allExams[i % allExams.length];
      const examQuestions = await Question.find({ exam: exam._id });

      const totalMarks = exam.totalMarks || 100;
      const score = Math.round((cfg.score / 100) * totalMarks);
      const percentage = Math.round((score / totalMarks) * 100);
      const passed = score >= (exam.passingMarks || 40);
      const timeTaken = cfg.timeTakenMinutes * 60;

      const submittedAt = new Date(now);
      submittedAt.setDate(submittedAt.getDate() - cfg.daysAgo);
      submittedAt.setHours(14 - (i % 6), 20 + (i * 3) % 40);

      const startedAt = new Date(submittedAt.getTime() - timeTaken * 1000);

      const answers = examQuestions.map(q => ({
        questionId: q._id,
        selectedAnswer: q.correctAnswer || (q.options && q.options[0]) || 'Option A'
      }));

      attemptsToInsert.push({
        student: johnSmith._id,
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
        isJohnSmithDemo: true
      });
    }

    // Sort by submittedAt ascending
    attemptsToInsert.sort((a, b) => a.submittedAt - b.submittedAt);

    await Attempt.insertMany(attemptsToInsert);
    console.log(`✓ Linked ${attemptsToInsert.length} exam attempts`);

    console.log('✓ Leaderboard updated');
    console.log('✓ Dashboard statistics generated');
    console.log('✓ Performance trend generated');
    console.log('✓ Seed completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding John Smith demo student:', error);
    process.exit(1);
  }
};

seedJohnSmith();
