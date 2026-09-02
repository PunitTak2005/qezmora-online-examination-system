const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');
const Attempt = require('../models/Attempt');
const Contact = require('../models/Contact');
const ExamViolation = require('../models/ExamViolation');

dotenv.config({ path: './.env' });

const runAudit = async () => {
  console.log('🚀 Starting Pre-Deployment QA Audit for Qezmora (MERN Stack)...\n');
  const results = {
    database: { status: 'PENDING', details: [] },
    auth: { status: 'PENDING', details: [] },
    exams: { status: 'PENDING', details: [] },
    questions: { status: 'PENDING', details: [] },
    categories: { status: 'PENDING', details: [] },
    attempts: { status: 'PENDING', details: [] },
    contactMessages: { status: 'PENDING', details: [] },
    violations: { status: 'PENDING', details: [] },
    quantumExam: { status: 'PENDING', details: [] }
  };

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    results.database.status = 'PASSED';
    results.database.details.push('Connected to MongoDB successfully');

    // 1. Audit Users
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    const studentCount = await User.countDocuments({ role: 'student' });
    
    results.auth.status = totalUsers > 0 && adminCount > 0 ? 'PASSED' : 'FAILED';
    results.auth.details.push(`Total Users: ${totalUsers} (Admins: ${adminCount}, Teachers: ${teacherCount}, Students: ${studentCount})`);

    // 2. Audit Exams
    const totalExams = await Exam.countDocuments();
    const publishedExams = await Exam.countDocuments({ status: 'published' });
    results.exams.status = publishedExams >= 25 ? 'PASSED' : 'WARNING';
    results.exams.details.push(`Total Exams: ${totalExams} (Published: ${publishedExams})`);

    // 3. Audit Questions
    const totalQuestions = await Question.countDocuments();
    results.questions.status = totalQuestions >= 500 ? 'PASSED' : 'WARNING';
    results.questions.details.push(`Total Question Bank Count: ${totalQuestions}`);

    // 4. Audit Categories
    const categoriesCount = await Category.countDocuments();
    results.categories.status = categoriesCount > 0 ? 'PASSED' : 'FAILED';
    results.categories.details.push(`Categories Count: ${categoriesCount}`);

    // 5. Audit Attempts
    const attemptsCount = await Attempt.countDocuments();
    const submittedAttempts = await Attempt.countDocuments({ status: 'submitted' });
    results.attempts.status = attemptsCount > 0 ? 'PASSED' : 'WARNING';
    results.attempts.details.push(`Total Attempts: ${attemptsCount} (Submitted: ${submittedAttempts})`);

    // 6. Audit Contact Messages
    const contactCount = await Contact.countDocuments();
    results.contactMessages.status = contactCount >= 0 ? 'PASSED' : 'FAILED';
    results.contactMessages.details.push(`Contact Messages in DB: ${contactCount}`);

    // 7. Audit Security Violations
    const violationsCount = await ExamViolation.countDocuments();
    results.violations.status = violationsCount >= 0 ? 'PASSED' : 'FAILED';
    results.violations.details.push(`Exam Security Violations in DB: ${violationsCount}`);

    // 7. Audit Quantum Computing Exam Specifically
    const quantumExam = await Exam.findOne({ title: "Advanced Quantum Computing & Algorithms" });
    if (quantumExam) {
      const qCount = await Question.countDocuments({ exam: quantumExam._id });
      results.quantumExam.status = qCount === 20 ? 'PASSED' : 'FAILED';
      results.quantumExam.details.push(`Quantum Exam ID: ${quantumExam._id} | Linked Questions: ${qCount}/20`);
    } else {
      results.quantumExam.status = 'FAILED';
      results.quantumExam.details.push('Quantum Computing exam not found in DB');
    }

    // Print Audit Results
    console.log('====================================================');
    console.log('📋 QEZMORA PRE-DEPLOYMENT QA AUDIT REPORT');
    console.log('====================================================');
    Object.keys(results).forEach(key => {
      const item = results[key];
      const icon = item.status === 'PASSED' ? '✅' : item.status === 'WARNING' ? '⚠️' : '❌';
      console.log(`${icon} [${key.toUpperCase()}]: ${item.status}`);
      item.details.forEach(d => console.log(`   - ${d}`));
    });
    console.log('====================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Pre-deployment audit error:', err);
    process.exit(1);
  }
};

runAudit();
