const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');
const Attempt = require('../models/Attempt');
const Contact = require('../models/Contact');
const ExamViolation = require('../models/ExamViolation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

const categoriesData = [
  { name: 'Programming', slug: 'programming', color: 'indigo', icon: 'Code', description: 'Software development, data structures, and web technologies.', isActive: true },
  { name: 'Mathematics', slug: 'mathematics', color: 'blue', icon: 'Calculator', description: 'Algebra, calculus, geometry, and numerical analysis.', isActive: true },
  { name: 'Science', slug: 'science', color: 'green', icon: 'FlaskConical', description: 'Physics, chemistry, biology, and environmental sciences.', isActive: true },
  { name: 'English', slug: 'english', color: 'red', icon: 'BookOpen', description: 'Grammar, vocabulary, reading comprehension, and business english.', isActive: true },
  { name: 'Aptitude', slug: 'aptitude', color: 'orange', icon: 'Brain', description: 'Quantitative aptitude, logical reasoning, and data interpretation.', isActive: true },
  { name: 'General Knowledge', slug: 'general-knowledge', color: 'amber', icon: 'Globe', description: 'Current affairs, world history, geography, and constitution.', isActive: true },
  { name: 'Advanced', slug: 'advanced', color: 'purple', icon: 'Sparkles', description: 'Cutting-edge technologies, quantum computing, and distributed systems.', isActive: true }
];

const examsList = [
  { title: "Advanced Quantum Computing & Algorithms", category: "Advanced", difficulty: "Hard" },
  { title: "Advanced System Architecture & Distributed Systems", category: "Advanced", difficulty: "Hard" },
  { title: "Full Stack Web Development Assessment", category: "Programming", difficulty: "Medium" },
  { title: "React Fundamentals", category: "Programming", difficulty: "Easy" },
  { title: "JavaScript Essentials", category: "Programming", difficulty: "Easy" },
  { title: "Python Programming", category: "Programming", difficulty: "Medium" },
  { title: "Algebra Mastery", category: "Mathematics", difficulty: "Medium" },
  { title: "Calculus Challenge", category: "Mathematics", difficulty: "Hard" },
  { title: "Geometry & Mensuration", category: "Mathematics", difficulty: "Medium" },
  { title: "Probability & Statistics", category: "Mathematics", difficulty: "Medium" },
  { title: "Physics Concepts", category: "Science", difficulty: "Hard" },
  { title: "Chemistry Fundamentals", category: "Science", difficulty: "Medium" },
  { title: "Biology Essentials", category: "Science", difficulty: "Easy" },
  { title: "Environmental Science", category: "Science", difficulty: "Easy" },
  { title: "Quantitative Aptitude", category: "Aptitude", difficulty: "Medium" },
  { title: "Logical Reasoning", category: "Aptitude", difficulty: "Medium" },
  { title: "Analytical Thinking", category: "Aptitude", difficulty: "Hard" },
  { title: "Data Interpretation", category: "Aptitude", difficulty: "Hard" },
  { title: "Current Affairs", category: "General Knowledge", difficulty: "Easy" },
  { title: "World History", category: "General Knowledge", difficulty: "Medium" },
  { title: "Geography Explorer", category: "General Knowledge", difficulty: "Easy" },
  { title: "Indian Constitution", category: "General Knowledge", difficulty: "Medium" },
  { title: "English Grammar", category: "English", difficulty: "Easy" },
  { title: "Reading Comprehension", category: "English", difficulty: "Medium" },
  { title: "Business English", category: "English", difficulty: "Medium" }
];

const studentsList = [
  { name: 'Aarav Sharma', email: 'aarav@qezmora.com', college: 'Indian Institute of Technology, Delhi' },
  { name: 'Priya Verma', email: 'priya@qezmora.com', college: 'National Institute of Technology, Trichy' },
  { name: 'Rohan Mehta', email: 'rohan@qezmora.com', college: 'BITS Pilani University' },
  { name: 'Neha Singh', email: 'neha@qezmora.com', college: 'Indian Institute of Technology, Bombay' },
  { name: 'Arjun Kapoor', email: 'arjun@qezmora.com', college: 'IIIT Hyderabad' },
  { name: 'Kavya Nair', email: 'kavya@qezmora.com', college: 'Vellore Institute of Technology' },
  { name: 'Ishita Jain', email: 'ishita@qezmora.com', college: 'Delhi Technological University' },
  { name: 'Rahul Joshi', email: 'rahul@qezmora.com', college: 'Techno NJR Institute of Technology' },
  { name: 'Sneha Patel', email: 'sneha@qezmora.com', college: 'Nirma University' },
  { name: 'Vivek Kumar', email: 'vivek@qezmora.com', college: 'Manipal Institute of Technology' },
  { name: 'Ananya Roy', email: 'ananya@qezmora.com', college: 'IIT Madras' },
  { name: 'Siddharth Malhotra', email: 'siddharth@qezmora.com', college: 'RV College of Engineering' },
  { name: 'Tanvi Gupta', email: 'tanvi@qezmora.com', college: 'Thapar University' },
  { name: 'Devendra Singh', email: 'devendra@qezmora.com', college: 'MNIT Jaipur' },
  { name: 'Pooja Reddy', email: 'pooja@qezmora.com', college: 'JNTU Hyderabad' }
];

const seedAtlas = async () => {
  console.log('🚀 Connecting to MongoDB Atlas...');
  console.log(`Connection Endpoint: ${MONGO_URI.replace(/:([^@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas successfully!\n');

    // 1. Seed Categories
    console.log('📦 Seeding Categories...');
    for (const cat of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true }
      );
    }
    const catCount = await Category.countDocuments();
    console.log(`✓ Categories Seeded: ${catCount}`);

    // 2. Seed Demo Users (Admin, Teacher, Student + 15 Students)
    console.log('👥 Seeding Production Users...');
    const defaultPassword = await bcrypt.hash('Password123!', 10);
    const altPassword = await bcrypt.hash('Admin@123', 10);

    // Primary Test Credentials matching LoginPage.jsx hints
    const adminExam = await User.findOneAndUpdate(
      { email: 'admin@exam.com' },
      {
        name: 'Admin User',
        email: 'admin@exam.com',
        password: defaultPassword,
        role: 'admin',
        college: 'Qezmora Academic Headquarters'
      },
      { upsert: true, new: true }
    );

    const teacherExam = await User.findOneAndUpdate(
      { email: 'teacher@exam.com' },
      {
        name: 'Dr. Sarah Johnson',
        email: 'teacher@exam.com',
        password: defaultPassword,
        role: 'teacher',
        college: 'Department of Computer Science'
      },
      { upsert: true, new: true }
    );

    const studentExam = await User.findOneAndUpdate(
      { email: 'student@exam.com' },
      {
        name: 'John Smith',
        email: 'student@exam.com',
        password: defaultPassword,
        role: 'student',
        college: 'Qezmora Technology Institute',
        course: 'Computer Science'
      },
      { upsert: true, new: true }
    );

    // Qezmora Domain Accounts
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@qezmora.com' },
      {
        name: 'Admin User',
        email: 'admin@qezmora.com',
        password: defaultPassword,
        role: 'admin',
        college: 'Qezmora Academic Headquarters'
      },
      { upsert: true, new: true }
    );

    const teacherUser = await User.findOneAndUpdate(
      { email: 'teacher@qezmora.com' },
      {
        name: 'Dr. Sarah Johnson',
        email: 'teacher@qezmora.com',
        password: defaultPassword,
        role: 'teacher',
        college: 'Department of Computer Science'
      },
      { upsert: true, new: true }
    );

    const demoStudent = await User.findOneAndUpdate(
      { email: 'student@qezmora.com' },
      {
        name: 'John Smith',
        email: 'student@qezmora.com',
        password: defaultPassword,
        role: 'student',
        college: 'Qezmora Technology Institute',
        course: 'Computer Science'
      },
      { upsert: true, new: true }
    );

    const createdStudents = [studentExam, demoStudent];
    for (const s of studentsList) {
      const studentDoc = await User.findOneAndUpdate(
        { email: s.email },
        {
          name: s.name,
          email: s.email,
          password: defaultPassword,
          role: 'student',
          college: s.college,
          course: 'Engineering & Science'
        },
        { upsert: true, new: true }
      );
    }
    const userCount = await User.countDocuments();
    console.log(`✓ Production Users Seeded: ${userCount}`);

    // 3. Seed 25 Published Exams
    console.log('📚 Seeding 25 Production Exams...');
    const createdExams = [];
    const categoryDocsMap = {};
    const allCatDocs = await Category.find();
    allCatDocs.forEach(c => { categoryDocsMap[c.name] = c._id; });

    for (const item of examsList) {
      const catId = categoryDocsMap[item.category] || allCatDocs[0]?._id;
      const difficultyLower = item.difficulty.toLowerCase();

      const examDoc = await Exam.findOneAndUpdate(
        { title: item.title },
        {
          title: item.title,
          subject: item.category,
          category: catId,
          difficulty: difficultyLower,
          duration: 60,
          totalMarks: 100,
          passingMarks: 40,
          teacher: teacherUser._id,
          status: 'published',
          description: `Comprehensive 60-minute evaluation testing fundamental to advanced principles of ${item.title}.`,
          instructions: 'Each question carries 5 marks. Maintain continuous fullscreen mode throughout the test.'
        },
        { upsert: true, new: true }
      );
      createdExams.push(examDoc);
    }
    const examCount = await Exam.countDocuments();
    console.log(`✓ Published Exams Seeded: ${examCount}`);

    // 4. Seed 500 Unique Questions (20 MCQs per Exam)
    console.log('❓ Seeding 500 MCQs across all exams...');
    for (const exam of createdExams) {
      const existingQCount = await Question.countDocuments({ exam: exam._id });
      if (existingQCount < 20) {
        // Clear old partial questions if any to guarantee clean 20 questions
        await Question.deleteMany({ exam: exam._id });
        const newQuestions = [];
        for (let i = 1; i <= 20; i++) {
          newQuestions.push({
            exam: exam._id,
            question: `Which fundamental principle or method best describes concept #${i} in ${exam.title}?`,
            type: 'mcq',
            options: [
              `Primary concept method option A for ${exam.title} #${i}`,
              `Standard operational principle option B for ${exam.title} #${i}`,
              `Advanced optimization approach option C for ${exam.title} #${i}`,
              `Theoretical framework option D for ${exam.title} #${i}`
            ],
            correctAnswer: (i % 4), // Option index 0, 1, 2, 3
            marks: 5,
            difficulty: exam.difficulty,
            explanation: `Option ${String.fromCharCode(65 + (i % 4))} is correct because it implements optimal logic for concept #${i} in ${exam.title}.`,
            topic: exam.category
          });
        }
        await Question.insertMany(newQuestions);
      }
    }
    const questionCount = await Question.countDocuments();
    console.log(`✓ Total MCQs Seeded: ${questionCount}`);

    // 5. Seed Contact Messages
    console.log('📨 Seeding Sample Support Inquiries...');
    const contactMessagesData = [
      { name: 'Rahul Verma', email: 'rahul.v@gmail.com', subject: 'Technical Issue during Exam', message: 'Faced a brief timeout error during quantum test. Kindly review attempt.', status: 'unread' },
      { name: 'Simran Kaur', email: 'simran.k@outlook.com', subject: 'Feature Request', message: 'Can we have dark theme options on the question palette?', status: 'unread' },
      { name: 'Amit Sharma', email: 'amit.s@yahoo.com', subject: 'Exam Support', message: 'Requesting clarification on score calculation for full stack assessment.', status: 'replied' },
      { name: 'Pooja Nair', email: 'pooja.n@gmail.com', subject: 'Account Help', message: 'Need help updating institution name in my student profile settings.', status: 'replied' },
      { name: 'Vikram Joshi', email: 'vikram.j@gmail.com', subject: 'Platform Inquiry', message: 'Will certificates be automatically generated after passing passingMarks cutoff?', status: 'archived' },
      { name: 'Deepika Patel', email: 'deepika.p@gmail.com', subject: 'Leaderboard Query', message: 'How frequently are weekly rankings calculated and refreshed?', status: 'unread' },
      { name: 'Karan Mehra', email: 'karan.m@gmail.com', subject: 'Secure Exam Mode', message: 'Appreciate the anti-cheating tab detection system!', status: 'replied' },
      { name: 'Siddharth Rao', email: 'siddharth.r@gmail.com', subject: 'System Performance', message: 'Page transition animations are extremely smooth and responsive.', status: 'unread' },
      { name: 'Megha Gupta', email: 'megha.g@gmail.com', subject: 'Mobile Interface', message: 'Exam cards render cleanly on mobile view without text overflow.', status: 'replied' },
      { name: 'Tarun Saxena', email: 'tarun.s@gmail.com', subject: 'Question Bank Feedback', message: 'Detailed explanations after submission really helped review topics.', status: 'unread' }
    ];
    for (const msg of contactMessagesData) {
      await Contact.findOneAndUpdate(
        { email: msg.email, subject: msg.subject },
        msg,
        { upsert: true, new: true }
      );
    }
    const contactCount = await Contact.countDocuments();
    console.log(`✓ Contact Messages Seeded: ${contactCount}`);

    // 6. Seed Student Attempts & Performance History
    console.log('📝 Seeding Completed Exam Attempts & Analytics...');
    const attemptsCount = await Attempt.countDocuments();
    if (attemptsCount < 20) {
      for (let i = 0; i < 25; i++) {
        const student = createdStudents[i % createdStudents.length];
        const exam = createdExams[i % createdExams.length];
        const score = Math.floor(Math.random() * 40) + 60; // 60-100
        const percentage = score;
        const passed = percentage >= exam.passingMarks;

        await Attempt.create({
          student: student._id,
          exam: exam._id,
          generatedQuestions: [],
          answers: [],
          score,
          totalMarks: 100,
          percentage,
          passed,
          status: 'submitted',
          timeTaken: 1800 + (i * 60),
          submittedAt: new Date(Date.now() - (i * 86400000))
        });
      }
    }
    const finalAttemptsCount = await Attempt.countDocuments();
    console.log(`✓ Completed Attempts Seeded: ${finalAttemptsCount}`);

    // 7. Seed Integrity Violations
    console.log('🛡️ Seeding Exam Security Violations...');
    const violationsCount = await ExamViolation.countDocuments();
    if (violationsCount < 15) {
      const violationTypes = ['fullscreen_exit', 'tab_switch', 'window_blur', 'devtools_open', 'copy_paste_attempt'];
      
      for (let i = 0; i < 16; i++) {
        const student = createdStudents[i % createdStudents.length];
        const exam = createdExams[i % createdExams.length];
        await ExamViolation.create({
          student: student._id,
          exam: exam._id,
          type: violationTypes[i % violationTypes.length],
          warningNumber: (i % 3) + 1,
          metadata: { details: `System detected anti-cheating violation event trigger #${i + 1}` },
          timestamp: new Date(Date.now() - (i * 3600000))
        });
      }
    }
    const finalViolationsCount = await ExamViolation.countDocuments();
    console.log(`✓ Security Violations Seeded: ${finalViolationsCount}`);

    // Final Audit & Output Table
    console.log('\n====================================================');
    console.log('🎉 MONGODB ATLAS PRODUCTION SEEDING COMPLETE');
    console.log('====================================================');
    console.log(`✓ Categories:        ${catCount}`);
    console.log(`✓ Exams:             ${examCount}`);
    console.log(`✓ Questions:         ${questionCount}`);
    console.log(`✓ Production Users:  ${userCount}`);
    console.log(`✓ Contact Messages:  ${contactCount}`);
    console.log(`✓ Completed Attempts:${finalAttemptsCount}`);
    console.log(`✓ Security Violations:${finalViolationsCount}`);
    console.log('====================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during Atlas seeding:', err);
    process.exit(1);
  }
};

seedAtlas();
