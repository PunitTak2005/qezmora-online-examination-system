const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

dotenv.config({ path: './.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('\x1b[36m%s\x1b[0m', '🔗 MongoDB Connected for Seeding...');

    // Clear all collections
    await User.deleteMany();
    await Exam.deleteMany();
    await Question.deleteMany();
    await Attempt.deleteMany();
    console.log('\x1b[33m%s\x1b[0m', '🗑️  Cleared existing data...');

    // Hash passwords manually (insertMany bypasses pre-save hooks)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    // ─── Create Users ────────────────────────────────────────────────────────
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@exam.com',
        password: hashedPassword,
        role: 'admin',
        college: 'Qezmora HQ',
        phone: '+1-000-000-0000',
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'teacher@exam.com',
        password: hashedPassword,
        role: 'teacher',
        college: 'Tech University',
        course: 'Computer Science',
        phone: '+1-555-010-0001',
      },
      {
        name: 'John Smith',
        email: 'student@exam.com',
        password: hashedPassword,
        role: 'student',
        college: 'Tech University',
        course: 'Computer Science',
        phone: '+1-555-020-0002',
      },
    ]);

    const teacherId = users[1]._id;
    const studentId = users[2]._id;
    const adminId = users[0]._id;
    console.log('\x1b[32m%s\x1b[0m', '👥 Users created...');

    // ─── Create Categories ───────────────────────────────────────────────────
    const Category = require('../models/Category');
    await Category.deleteMany();
    const categories = await Category.insertMany([
      { name: 'Mathematics', slug: 'mathematics', description: 'Algebra, Geometry, Calculus, and more.', icon: 'Calculator', color: 'blue', createdBy: adminId },
      { name: 'Science', slug: 'science', description: 'Physics, Chemistry, and Biology fundamentals.', icon: 'FlaskConical', color: 'green', createdBy: adminId },
      { name: 'Programming', slug: 'programming', description: 'Coding languages, algorithms, and logic.', icon: 'Code', color: 'indigo', createdBy: adminId },
      { name: 'English', slug: 'english', description: 'Grammar, literature, and comprehension.', icon: 'BookA', color: 'red', createdBy: adminId },
      { name: 'General Knowledge', slug: 'general-knowledge', description: 'Trivia, history, and global facts.', icon: 'Globe', color: 'amber', createdBy: adminId },
      { name: 'Logical Reasoning', slug: 'logical-reasoning', description: 'Puzzles, patterns, and critical thinking.', icon: 'BrainCircuit', color: 'purple', createdBy: adminId },
      { name: 'Aptitude', slug: 'aptitude', description: 'Quantitative and qualitative problem solving.', icon: 'Target', color: 'orange', createdBy: adminId },
      { name: 'Current Affairs', slug: 'current-affairs', description: 'Latest news and global events.', icon: 'Newspaper', color: 'cyan', createdBy: adminId },
      { name: 'Computer Science', slug: 'computer-science', description: 'Hardware, software, and systems.', icon: 'Monitor', color: 'teal', createdBy: adminId }
    ]);
    console.log('\x1b[32m%s\x1b[0m', '📂 Categories created...');

    const getCatId = (slug) => categories.find(c => c.slug === slug)._id;

    // ─── Create Exams ─────────────────────────────────────────────────────────
    const exams = await Exam.insertMany([
        {
          title: 'React Fundamentals',
          subject: 'Programming',
          description: 'Comprehensive assessment for React Fundamentals.',
          duration: 45,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('programming'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'JavaScript Essentials',
          subject: 'Programming',
          description: 'Comprehensive assessment for JavaScript Essentials.',
          duration: 30,
          totalMarks: 15,
          passingMarks: 7,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('programming'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Python Programming',
          subject: 'Programming',
          description: 'Comprehensive assessment for Python Programming.',
          duration: 60,
          totalMarks: 30,
          passingMarks: 15,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('programming'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Full Stack Web Development',
          subject: 'Programming',
          description: 'Comprehensive assessment for Full Stack Web Development.',
          duration: 60,
          totalMarks: 30,
          passingMarks: 15,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('programming'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Algebra Mastery',
          subject: 'Mathematics',
          description: 'Comprehensive assessment for Algebra Mastery.',
          duration: 30,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('mathematics'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Calculus Challenge',
          subject: 'Mathematics',
          description: 'Comprehensive assessment for Calculus Challenge.',
          duration: 45,
          totalMarks: 25,
          passingMarks: 12,
          teacher: teacherId,
          status: 'published',
          difficulty: 'hard',
          category: getCatId('mathematics'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Geometry & Mensuration',
          subject: 'Mathematics',
          description: 'Comprehensive assessment for Geometry & Mensuration.',
          duration: 35,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('mathematics'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Probability & Statistics',
          subject: 'Mathematics',
          description: 'Comprehensive assessment for Probability & Statistics.',
          duration: 40,
          totalMarks: 25,
          passingMarks: 12,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('mathematics'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Physics Concepts',
          subject: 'Science',
          description: 'Comprehensive assessment for Physics Concepts.',
          duration: 40,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('science'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Chemistry Fundamentals',
          subject: 'Science',
          description: 'Comprehensive assessment for Chemistry Fundamentals.',
          duration: 35,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('science'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Biology Essentials',
          subject: 'Science',
          description: 'Comprehensive assessment for Biology Essentials.',
          duration: 30,
          totalMarks: 18,
          passingMarks: 9,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('science'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Environmental Science',
          subject: 'Science',
          description: 'Comprehensive assessment for Environmental Science.',
          duration: 25,
          totalMarks: 15,
          passingMarks: 7,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('science'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'English Grammar',
          subject: 'English',
          description: 'Comprehensive assessment for English Grammar.',
          duration: 25,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('english'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Reading Comprehension',
          subject: 'English',
          description: 'Comprehensive assessment for Reading Comprehension.',
          duration: 30,
          totalMarks: 18,
          passingMarks: 9,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('english'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Vocabulary Builder',
          subject: 'English',
          description: 'Comprehensive assessment for Vocabulary Builder.',
          duration: 20,
          totalMarks: 15,
          passingMarks: 7,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('english'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Business English',
          subject: 'English',
          description: 'Comprehensive assessment for Business English.',
          duration: 35,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('english'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Quantitative Aptitude',
          subject: 'Aptitude',
          description: 'Comprehensive assessment for Quantitative Aptitude.',
          duration: 40,
          totalMarks: 25,
          passingMarks: 12,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('aptitude'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Logical Reasoning',
          subject: 'Aptitude',
          description: 'Comprehensive assessment for Logical Reasoning.',
          duration: 30,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('aptitude'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Analytical Thinking',
          subject: 'Aptitude',
          description: 'Comprehensive assessment for Analytical Thinking.',
          duration: 35,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'hard',
          category: getCatId('aptitude'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Data Interpretation',
          subject: 'Aptitude',
          description: 'Comprehensive assessment for Data Interpretation.',
          duration: 40,
          totalMarks: 25,
          passingMarks: 12,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('aptitude'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Current Affairs',
          subject: 'General Knowledge',
          description: 'Comprehensive assessment for Current Affairs.',
          duration: 20,
          totalMarks: 15,
          passingMarks: 7,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('general-knowledge'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'World History',
          subject: 'General Knowledge',
          description: 'Comprehensive assessment for World History.',
          duration: 30,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('general-knowledge'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Geography Explorer',
          subject: 'General Knowledge',
          description: 'Comprehensive assessment for Geography Explorer.',
          duration: 25,
          totalMarks: 18,
          passingMarks: 9,
          teacher: teacherId,
          status: 'published',
          difficulty: 'easy',
          category: getCatId('general-knowledge'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
        {
          title: 'Indian Constitution',
          subject: 'General Knowledge',
          description: 'Comprehensive assessment for Indian Constitution.',
          duration: 35,
          totalMarks: 20,
          passingMarks: 10,
          teacher: teacherId,
          status: 'published',
          difficulty: 'medium',
          category: getCatId('general-knowledge'),
          instructions: 'Read each question carefully. Auto-graded.',
        },
      ]);
    console.log('\x1b[32m%s\x1b[0m', '📝 Exams created...');

    // ─── Questions: JavaScript Fundamentals (exam[0]) ─────────────────────────
    const jsQuestions = await Question.insertMany([
      { exam: exams[0]._id, question: 'What is a closure in JavaScript?', type: 'mcq', options: ['A function that has access to its outer scope variables', 'A blocked scope', 'A loop mechanism', 'A callback function'], correctAnswer: 'A function that has access to its outer scope variables', marks: 5, difficulty: 'medium', topic: 'Closures', explanation: 'A closure is a function that retains access to variables from its enclosing lexical scope even after the outer function has returned.' },
      { exam: exams[0]._id, question: 'JavaScript is a single-threaded language.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'easy', topic: 'Concurrency' },
      { exam: exams[0]._id, question: 'Which keyword is used to declare a block-scoped variable in ES6?', type: 'mcq', options: ['var', 'let', 'def', 'local'], correctAnswer: 'let', marks: 5, difficulty: 'easy', topic: 'ES6', explanation: 'let declares a block-scoped variable, unlike var which is function-scoped.' },
      { exam: exams[0]._id, question: 'What does the spread operator (...) do?', type: 'mcq', options: ['Spreads elements of an iterable into individual elements', 'Merges two functions', 'Creates a new array type', 'Declares rest parameters only'], correctAnswer: 'Spreads elements of an iterable into individual elements', marks: 5, difficulty: 'medium', topic: 'ES6' },
      { exam: exams[0]._id, question: 'Promise.all() resolves when _____.', type: 'mcq', options: ['All promises resolve', 'The first promise resolves', 'Any one promise rejects', 'All promises reject'], correctAnswer: 'All promises resolve', marks: 5, difficulty: 'medium', topic: 'Async' },
      { exam: exams[0]._id, question: 'typeof null returns "object".', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'medium', topic: 'Types', explanation: 'This is a known quirk/bug in JavaScript — typeof null returns "object".' },
      { exam: exams[0]._id, question: 'Which method is used to add one or more elements to the end of an array?', type: 'mcq', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 'push()', marks: 5, difficulty: 'easy', topic: 'Arrays' },
      { exam: exams[0]._id, question: '=== checks both value and type.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'easy', topic: 'Operators' },
      { exam: exams[0]._id, question: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?', type: 'mcq', options: ['false', 'true', 'undefined', 'NaN'], correctAnswer: 'false', marks: 5, difficulty: 'hard', topic: 'Types', explanation: 'Floating point arithmetic in JavaScript leads to precision errors.' },
      { exam: exams[0]._id, question: 'The _____ method creates a new array with all elements that pass a test.', type: 'fill-blank', correctAnswer: 'filter', marks: 5, difficulty: 'easy', topic: 'Arrays' },
    ]);

    // ─── Questions: Python Basics (exam[1]) ──────────────────────────────────
    const pyQuestions = await Question.insertMany([
      { exam: exams[1]._id, question: 'Which of the following is a mutable data type in Python?', type: 'mcq', options: ['tuple', 'string', 'list', 'int'], correctAnswer: 'list', marks: 4, difficulty: 'easy', topic: 'Data Types' },
      { exam: exams[1]._id, question: 'Python is an interpreted language.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 4, difficulty: 'easy', topic: 'Language Basics' },
      { exam: exams[1]._id, question: 'What is the output of: len("hello")?', type: 'mcq', options: ['4', '5', '6', 'Error'], correctAnswer: '5', marks: 4, difficulty: 'easy', topic: 'Strings' },
      { exam: exams[1]._id, question: 'How do you define a function in Python?', type: 'mcq', options: ['function myFunc():', 'def myFunc():', 'fun myFunc():', 'define myFunc():'], correctAnswer: 'def myFunc():', marks: 4, difficulty: 'easy', topic: 'Functions' },
      { exam: exams[1]._id, question: 'List comprehension in Python is slower than a for-loop for large datasets.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'False', marks: 4, difficulty: 'medium', topic: 'Performance' },
      { exam: exams[1]._id, question: 'What keyword is used to handle exceptions in Python?', type: 'mcq', options: ['catch', 'except', 'error', 'handle'], correctAnswer: 'except', marks: 4, difficulty: 'easy', topic: 'Error Handling' },
      { exam: exams[1]._id, question: 'Which Python data structure stores key-value pairs?', type: 'mcq', options: ['list', 'set', 'dict', 'tuple'], correctAnswer: 'dict', marks: 4, difficulty: 'easy', topic: 'Data Structures' },
      { exam: exams[1]._id, question: 'The _____ keyword is used for inheritance in Python class definition.', type: 'fill-blank', correctAnswer: 'class', marks: 4, difficulty: 'medium', topic: 'OOP' },
      { exam: exams[1]._id, question: 'What is the range of range(5)?', type: 'mcq', options: ['1 to 5', '0 to 5', '0 to 4', '1 to 4'], correctAnswer: '0 to 4', marks: 4, difficulty: 'easy', topic: 'Built-ins' },
      { exam: exams[1]._id, question: 'Python supports multiple inheritance.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 4, difficulty: 'medium', topic: 'OOP' },
    ]);

    // ─── Questions: Data Structures (exam[2]) ─────────────────────────────────
    const dsQuestions = await Question.insertMany([
      { exam: exams[2]._id, question: 'What is the time complexity of binary search?', type: 'mcq', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctAnswer: 'O(log n)', marks: 6, difficulty: 'medium', topic: 'Searching' },
      { exam: exams[2]._id, question: 'A stack follows FIFO order.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'False', marks: 6, difficulty: 'easy', topic: 'Stack', explanation: 'A stack follows LIFO (Last In, First Out). FIFO is Queue.' },
      { exam: exams[2]._id, question: 'Which data structure uses nodes with a reference to the next node?', type: 'mcq', options: ['Array', 'Linked List', 'Hash Table', 'Stack'], correctAnswer: 'Linked List', marks: 6, difficulty: 'easy', topic: 'Linked List' },
      { exam: exams[2]._id, question: 'What is the worst-case time complexity of QuickSort?', type: 'mcq', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correctAnswer: 'O(n²)', marks: 6, difficulty: 'hard', topic: 'Sorting' },
      { exam: exams[2]._id, question: 'A binary search tree (BST) must have its left child less than the parent.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 6, difficulty: 'medium', topic: 'Trees' },
      { exam: exams[2]._id, question: 'Which traversal visits Root → Left → Right?', type: 'mcq', options: ['Inorder', 'Postorder', 'Preorder', 'Level-order'], correctAnswer: 'Preorder', marks: 6, difficulty: 'medium', topic: 'Trees' },
      { exam: exams[2]._id, question: 'What data structure is used for BFS?', type: 'mcq', options: ['Stack', 'Queue', 'Heap', 'Array'], correctAnswer: 'Queue', marks: 6, difficulty: 'medium', topic: 'Graphs' },
      { exam: exams[2]._id, question: 'Insertion into a hash table is O(1) on average.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 6, difficulty: 'medium', topic: 'Hash Tables' },
      { exam: exams[2]._id, question: 'Which sorting algorithm has O(n log n) average and worst case?', type: 'mcq', options: ['QuickSort', 'Bubble Sort', 'Merge Sort', 'Insertion Sort'], correctAnswer: 'Merge Sort', marks: 6, difficulty: 'hard', topic: 'Sorting' },
      { exam: exams[2]._id, question: 'A _____ is a tree where every parent has at most two children.', type: 'fill-blank', correctAnswer: 'binary tree', marks: 6, difficulty: 'easy', topic: 'Trees' },
    ]);

    // ─── Questions: Web Development (exam[3]) ─────────────────────────────────
    const webQuestions = await Question.insertMany([
      { exam: exams[3]._id, question: 'What does HTML stand for?', type: 'mcq', options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Machine Language', 'Hyper Transfer Markup Language'], correctAnswer: 'HyperText Markup Language', marks: 5, difficulty: 'easy', topic: 'HTML' },
      { exam: exams[3]._id, question: 'CSS Flexbox is a one-dimensional layout model.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'easy', topic: 'CSS' },
      { exam: exams[3]._id, question: 'Which CSS property controls the text size?', type: 'mcq', options: ['text-size', 'font-size', 'text-style', 'font-style'], correctAnswer: 'font-size', marks: 5, difficulty: 'easy', topic: 'CSS' },
      { exam: exams[3]._id, question: 'What is the correct HTML element for inserting a line break?', type: 'mcq', options: ['<break>', '<lb>', '<br>', '<newline>'], correctAnswer: '<br>', marks: 5, difficulty: 'easy', topic: 'HTML' },
      { exam: exams[3]._id, question: 'The DOM stands for Document Object Model.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'easy', topic: 'DOM' },
      { exam: exams[3]._id, question: 'Which HTTP status code means "Not Found"?', type: 'mcq', options: ['200', '301', '404', '500'], correctAnswer: '404', marks: 5, difficulty: 'easy', topic: 'HTTP' },
      { exam: exams[3]._id, question: 'Which CSS Grid property defines the number of columns?', type: 'mcq', options: ['grid-columns', 'grid-template-columns', 'column-count', 'grid-cols'], correctAnswer: 'grid-template-columns', marks: 5, difficulty: 'medium', topic: 'CSS Grid' },
      { exam: exams[3]._id, question: 'REST API stands for Representational State Transfer.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'easy', topic: 'APIs' },
      { exam: exams[3]._id, question: 'The _____ attribute specifies the URL of the link in an anchor tag.', type: 'fill-blank', correctAnswer: 'href', marks: 5, difficulty: 'easy', topic: 'HTML' },
      { exam: exams[3]._id, question: 'Which HTML tag is used to define an internal CSS style sheet?', type: 'mcq', options: ['<script>', '<css>', '<style>', '<head>'], correctAnswer: '<style>', marks: 5, difficulty: 'easy', topic: 'HTML/CSS' },
    ]);

    // ─── Questions: Database Management (exam[4]) ─────────────────────────────
    const dbQuestions = await Question.insertMany([
      { exam: exams[4]._id, question: 'Which SQL command is used to retrieve data from a database?', type: 'mcq', options: ['GET', 'SELECT', 'FETCH', 'PULL'], correctAnswer: 'SELECT', marks: 5, difficulty: 'easy', topic: 'SQL Basics' },
      { exam: exams[4]._id, question: 'A PRIMARY KEY can contain NULL values.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'False', marks: 5, difficulty: 'easy', topic: 'Keys', explanation: 'Primary keys must be unique and NOT NULL.' },
      { exam: exams[4]._id, question: 'What does SQL JOIN do?', type: 'mcq', options: ['Deletes rows from two tables', 'Combines rows from two or more tables', 'Creates a new table', 'Updates multiple tables'], correctAnswer: 'Combines rows from two or more tables', marks: 5, difficulty: 'medium', topic: 'Joins' },
      { exam: exams[4]._id, question: 'Which normal form eliminates partial dependencies?', type: 'mcq', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '2NF', marks: 5, difficulty: 'hard', topic: 'Normalization' },
      { exam: exams[4]._id, question: 'An index improves the speed of data retrieval operations.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'True', marks: 5, difficulty: 'medium', topic: 'Indexing' },
      { exam: exams[4]._id, question: 'What does ACID stand for in database transactions?', type: 'mcq', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'Atomicity, Concurrency, Integrity, Durability', 'None of the above'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability', marks: 5, difficulty: 'medium', topic: 'Transactions' },
      { exam: exams[4]._id, question: 'Which SQL clause is used to filter results of aggregate functions?', type: 'mcq', options: ['WHERE', 'HAVING', 'FILTER', 'LIMIT'], correctAnswer: 'HAVING', marks: 5, difficulty: 'medium', topic: 'SQL Clauses' },
      { exam: exams[4]._id, question: 'MongoDB is a relational database.', type: 'true-false', options: ['True', 'False'], correctAnswer: 'False', marks: 5, difficulty: 'easy', topic: 'NoSQL' },
      { exam: exams[4]._id, question: 'A _____ key references a PRIMARY KEY in another table.', type: 'fill-blank', correctAnswer: 'foreign', marks: 5, difficulty: 'easy', topic: 'Keys' },
      { exam: exams[4]._id, question: 'What is the purpose of GROUP BY in SQL?', type: 'mcq', options: ['Sort results', 'Group rows sharing a property for aggregate functions', 'Filter rows', 'Join tables'], correctAnswer: 'Group rows sharing a property for aggregate functions', marks: 5, difficulty: 'medium', topic: 'SQL Clauses' },
    ]);

    console.log('\x1b[32m%s\x1b[0m', `❓ ${jsQuestions.length + pyQuestions.length + dsQuestions.length + webQuestions.length + dbQuestions.length} Questions created...`);

    // ─── Sample Attempts ──────────────────────────────────────────────────────
    const now = new Date();
    const sampleAttempts = [
      {
        student: studentId,
        exam: exams[0]._id,
        answers: jsQuestions.map((q, i) => ({ questionId: q._id, selectedAnswer: i < 8 ? q.correctAnswer : 'Wrong Answer' })),
        score: 40, totalMarks: 50, percentage: 80, passed: true, timeTaken: 2400,
        submittedAt: new Date(now - 6 * 24 * 60 * 60 * 1000),
      },
      {
        student: studentId,
        exam: exams[1]._id,
        answers: pyQuestions.map((q, i) => ({ questionId: q._id, selectedAnswer: i < 9 ? q.correctAnswer : 'Wrong Answer' })),
        score: 36, totalMarks: 40, percentage: 90, passed: true, timeTaken: 1800,
        submittedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
      },
      {
        student: studentId,
        exam: exams[2]._id,
        answers: dsQuestions.map((q, i) => ({ questionId: q._id, selectedAnswer: i < 5 ? q.correctAnswer : 'Wrong Answer' })),
        score: 30, totalMarks: 60, percentage: 50, passed: true, timeTaken: 3600,
        submittedAt: new Date(now - 4 * 24 * 60 * 60 * 1000),
      },
      {
        student: studentId,
        exam: exams[3]._id,
        answers: webQuestions.map((q, i) => ({ questionId: q._id, selectedAnswer: i < 7 ? q.correctAnswer : 'Wrong Answer' })),
        score: 35, totalMarks: 50, percentage: 70, passed: true, timeTaken: 2700,
        submittedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
      },
      {
        student: studentId,
        exam: exams[4]._id,
        answers: dbQuestions.map((q, i) => ({ questionId: q._id, selectedAnswer: i < 4 ? q.correctAnswer : 'Wrong Answer' })),
        score: 20, totalMarks: 50, percentage: 40, passed: false, timeTaken: 3000,
        submittedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    await Attempt.insertMany(sampleAttempts);
    console.log('\x1b[32m%s\x1b[0m', '📊 Sample attempts created...');

    console.log('\x1b[32m%s\x1b[0m', '\n✅ Database seeded successfully!\n');
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\x1b[36m%s\x1b[0m', '  Test Credentials (Password123!)');
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin:   admin@exam.com');
    console.log('  Teacher: teacher@exam.com');
    console.log('  Student: student@exam.com');
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `\n❌ Seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();

