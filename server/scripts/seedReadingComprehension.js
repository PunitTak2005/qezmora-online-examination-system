const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

const passages = {
  p1: "Passage 1 — Remote Work:\nMany companies have adopted remote work because it offers employees greater flexibility. Workers can save commuting time and often achieve a better work-life balance. However, remote work also presents challenges such as communication gaps and feelings of isolation. Organizations are increasingly investing in collaboration tools and virtual team-building activities to maintain productivity and employee engagement.",
  p2: "Passage 2 — Artificial Intelligence:\nArtificial Intelligence (AI) is transforming industries by automating repetitive tasks and assisting in complex decision-making. While AI improves efficiency, experts emphasize that human oversight remains essential. Ethical concerns, including privacy and fairness, continue to shape discussions about responsible AI development.",
  p3: "Passage 3 — Healthy Habits:\nRegular exercise, balanced nutrition, and sufficient sleep contribute significantly to overall health. Experts recommend exercising for at least 150 minutes per week. Small lifestyle changes, such as walking instead of driving short distances, can also improve long-term well-being.",
  p4: "Passage 4 — Renewable Energy:\nRenewable energy sources such as solar and wind power help reduce greenhouse gas emissions. Although installation costs can be high initially, long-term savings and environmental benefits make renewable energy an attractive investment. Governments worldwide are encouraging cleaner energy through subsidies and incentives.",
  p5: "Passage 5 — Lifelong Learning:\nIn today's rapidly changing world, learning does not stop after graduation. Professionals who continuously develop new skills remain more competitive in the job market. Online courses, certifications, and workshops have made lifelong learning more accessible than ever before."
};

const rcMCQs = [
  // Passage 1
  {
    passageKey: 'p1',
    question: `${passages.p1}\n\nQ1. What is the main benefit of remote work mentioned in the passage?`,
    options: ["Higher salaries", "Greater flexibility", "More office meetings", "Shorter work hours"],
    correctAnswer: "Greater flexibility",
    explanation: "The passage explicitly states that remote work offers employees greater flexibility."
  },
  {
    passageKey: 'p1',
    question: `${passages.p1}\n\nQ2. Which challenge is associated with remote work?`,
    options: ["Increased travel expenses", "Communication gaps", "Fewer job opportunities", "Longer office hours"],
    correctAnswer: "Communication gaps",
    explanation: "The passage lists communication gaps and feelings of isolation as challenges."
  },
  {
    passageKey: 'p1',
    question: `${passages.p1}\n\nQ3. Why are companies investing in collaboration tools?`,
    options: ["To reduce employee salaries", "To maintain productivity and engagement", "To eliminate remote work", "To increase office attendance"],
    correctAnswer: "To maintain productivity and engagement",
    explanation: "Organizations invest in tools and activities to maintain productivity and employee engagement."
  },
  {
    passageKey: 'p1',
    question: `${passages.p1}\n\nQ4. The tone of the passage is:`,
    options: ["Critical", "Informative", "Humorous", "Emotional"],
    correctAnswer: "Informative",
    explanation: "The passage objectively presents facts, benefits, and challenges of remote work without emotional bias."
  },

  // Passage 2
  {
    passageKey: 'p2',
    question: `${passages.p2}\n\nQ5. According to the passage, AI primarily helps by:`,
    options: ["Replacing all workers", "Automating repetitive tasks", "Eliminating businesses", "Reducing internet usage"],
    correctAnswer: "Automating repetitive tasks",
    explanation: "The passage highlights that AI transforms industries by automating repetitive tasks."
  },
  {
    passageKey: 'p2',
    question: `${passages.p2}\n\nQ6. What remains essential despite AI advancements?`,
    options: ["More computers", "Human oversight", "Faster internet", "Paper records"],
    correctAnswer: "Human oversight",
    explanation: "Experts emphasize that human oversight remains essential despite AI advancements."
  },
  {
    passageKey: 'p2',
    question: `${passages.p2}\n\nQ7. Which concern is mentioned regarding AI?`,
    options: ["Weather forecasting", "Privacy", "Transportation", "Agriculture"],
    correctAnswer: "Privacy",
    explanation: "The passage explicitly mentions privacy and fairness as ethical concerns."
  },
  {
    passageKey: 'p2',
    question: `${passages.p2}\n\nQ8. The passage mainly discusses:`,
    options: ["The history of AI", "AI's benefits and challenges", "Computer hardware", "Social media"],
    correctAnswer: "AI's benefits and challenges",
    explanation: "The text covers both the efficiency benefits of AI and the ethical/oversight challenges."
  },

  // Passage 3
  {
    passageKey: 'p3',
    question: `${passages.p3}\n\nQ9. How many minutes of exercise are recommended weekly?`,
    options: ["60", "90", "120", "150"],
    correctAnswer: "150",
    explanation: "The passage explicitly recommends exercising for at least 150 minutes per week."
  },
  {
    passageKey: 'p3',
    question: `${passages.p3}\n\nQ10. Which habit is suggested for better health?`,
    options: ["Sleeping less", "Walking short distances", "Skipping meals", "Working longer hours"],
    correctAnswer: "Walking short distances",
    explanation: "Walking instead of driving short distances is suggested as a positive lifestyle change."
  },
  {
    passageKey: 'p3',
    question: `${passages.p3}\n\nQ11. What is the passage mainly about?`,
    options: ["Sports competitions", "Healthy lifestyle habits", "Driving safety", "Medical treatments"],
    correctAnswer: "Healthy lifestyle habits",
    explanation: "The central focus is how exercise, nutrition, sleep, and small changes promote health."
  },
  {
    passageKey: 'p3',
    question: `${passages.p3}\n\nQ12. Which word is closest in meaning to "well-being"?`,
    options: ["Illness", "Happiness and health", "Wealth", "Strength alone"],
    correctAnswer: "Happiness and health",
    explanation: "Well-being refers to the state of being comfortable, healthy, or happy."
  },

  // Passage 4
  {
    passageKey: 'p4',
    question: `${passages.p4}\n\nQ13. Which energy sources are mentioned?`,
    options: ["Coal and oil", "Solar and wind", "Nuclear and gas", "Diesel and petrol"],
    correctAnswer: "Solar and wind",
    explanation: "The text specifically names solar and wind power as renewable energy sources."
  },
  {
    passageKey: 'p4',
    question: `${passages.p4}\n\nQ14. Why do governments promote renewable energy?`,
    options: ["To increase pollution", "To encourage cleaner energy", "To reduce electricity use", "To close power plants"],
    correctAnswer: "To encourage cleaner energy",
    explanation: "Governments worldwide encourage cleaner energy through subsidies and incentives."
  },
  {
    passageKey: 'p4',
    question: `${passages.p4}\n\nQ15. What is one disadvantage mentioned?`,
    options: ["Low efficiency", "High initial installation cost", "Lack of electricity", "Limited sunlight everywhere"],
    correctAnswer: "High initial installation cost",
    explanation: "The passage notes that installation costs can be high initially."
  },
  {
    passageKey: 'p4',
    question: `${passages.p4}\n\nQ16. The passage suggests renewable energy is:`,
    options: ["A poor investment", "A temporary solution", "A beneficial long-term investment", "Unnecessary"],
    correctAnswer: "A beneficial long-term investment",
    explanation: "Long-term savings and environmental benefits make renewable energy an attractive investment."
  },

  // Passage 5
  {
    passageKey: 'p5',
    question: `${passages.p5}\n\nQ17. Why is lifelong learning important?`,
    options: ["It guarantees promotions.", "It helps professionals stay competitive.", "It replaces formal education.", "It reduces working hours."],
    correctAnswer: "It helps professionals stay competitive.",
    explanation: "Professionals who continuously develop new skills remain more competitive in the job market."
  },
  {
    passageKey: 'p5',
    question: `${passages.p5}\n\nQ18. Which learning methods are mentioned?`,
    options: ["Television only", "Newspapers only", "Online courses and workshops", "Radio programs"],
    correctAnswer: "Online courses and workshops",
    explanation: "Online courses, certifications, and workshops are explicitly highlighted."
  },
  {
    passageKey: 'p5',
    question: `${passages.p5}\n\nQ19. What does the phrase "more accessible" imply?`,
    options: ["More difficult to obtain", "Easier to access", "More expensive", "Less popular"],
    correctAnswer: "Easier to access",
    explanation: "Accessible in this context means simpler and more available to reach."
  },
  {
    passageKey: 'p5',
    question: `${passages.p5}\n\nQ20. What is the central message of the passage?`,
    options: ["Graduation ends education.", "Only universities provide learning.", "Continuous learning is valuable in a changing world.", "Online learning is unnecessary."],
    correctAnswer: "Continuous learning is valuable in a changing world.",
    explanation: "The core thesis is that learning must continue beyond formal graduation in a fast-changing world."
  }
];

const seedReadingComprehension = async () => {
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas successfully!\n');

    // 1. Find English Category
    const englishCategory = await Category.findOne({ slug: 'english' });
    const teacherUser = await User.findOne({ role: 'teacher' });

    // 2. Upsert Reading Comprehension Exam
    const examDoc = await Exam.findOneAndUpdate(
      { title: 'Reading Comprehension' },
      {
        title: 'Reading Comprehension',
        subject: 'English',
        category: englishCategory ? englishCategory._id : null,
        description: 'Comprehensive 30-minute evaluation testing critical reading, passage inference, factual recall, vocabulary, and authorial intent across 5 short passages.',
        duration: 30,
        totalMarks: 100,
        passingMarks: 40,
        difficulty: 'medium',
        status: 'published',
        instructions: 'Read each passage carefully before selecting the best answer. Each question carries 5 marks. Maintain continuous fullscreen mode throughout.',
        teacher: teacherUser ? teacherUser._id : null,
        questionCount: 20
      },
      { upsert: true, new: true }
    );

    console.log(`✓ Reading Comprehension Exam Upserted (ID: ${examDoc._id})`);

    // 3. Clear existing questions for Reading Comprehension
    await Question.deleteMany({ exam: examDoc._id });

    // 4. Insert the 20 MCQs
    const questionsToInsert = rcMCQs.map(q => ({
      exam: examDoc._id,
      category: englishCategory ? englishCategory._id : null,
      question: q.question,
      type: 'mcq',
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: 5,
      difficulty: 'medium',
      explanation: q.explanation,
      status: 'active'
    }));

    await Question.insertMany(questionsToInsert);

    // 5. Update Question Count on Exam
    const totalQs = await Question.countDocuments({ exam: examDoc._id });
    examDoc.questionCount = totalQs;
    await examDoc.save();

    console.log(`✓ Successfully seeded ${totalQs} MCQs across 5 Passages for Reading Comprehension Exam!`);
    console.log('====================================================');
    console.log('🎉 READING COMPREHENSION EXAM SEEDING COMPLETE');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Reading Comprehension exam:', error);
    process.exit(1);
  }
};

seedReadingComprehension();
