const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

const constitutionMCQs = [
  {
    question: "When did the Constitution of India come into effect?",
    options: ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"],
    correctAnswer: "26 January 1950",
    explanation: "The Constitution of India came into effect on 26 January 1950, celebrated nationwide as Republic Day."
  },
  {
    question: "Who is known as the \"Father of the Indian Constitution\"?",
    options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Dr. B. R. Ambedkar", "Sardar Patel"],
    correctAnswer: "Dr. B. R. Ambedkar",
    explanation: "Dr. Bhimrao Ramji Ambedkar served as the Chairman of the Drafting Committee."
  },
  {
    question: "Which part of the Constitution contains the Fundamental Rights?",
    options: ["Part II", "Part III", "Part IV", "Part V"],
    correctAnswer: "Part III",
    explanation: "Part III of the Indian Constitution (Articles 12 to 35) guarantees Fundamental Rights."
  },
  {
    question: "How many Fundamental Rights are currently guaranteed by the Constitution?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "6",
    explanation: "There are currently 6 Fundamental Rights (Right to Property was deleted by the 44th Amendment)."
  },
  {
    question: "Which Article guarantees the Right to Equality?",
    options: ["Article 14", "Article 19", "Article 21", "Article 32"],
    correctAnswer: "Article 14",
    explanation: "Article 14 guarantees equality before law and equal protection of the laws."
  },
  {
    question: "Which Article is known as the \"Heart and Soul of the Constitution\"?",
    options: ["Article 14", "Article 21", "Article 32", "Article 44"],
    correctAnswer: "Article 32",
    explanation: "Dr. B.R. Ambedkar termed Article 32 (Right to Constitutional Remedies) as the heart and soul of the Constitution."
  },
  {
    question: "The Directive Principles of State Policy are found in:",
    options: ["Part III", "Part IV", "Part IVA", "Part V"],
    correctAnswer: "Part IV",
    explanation: "Part IV (Articles 36 to 51) contains the Directive Principles of State Policy."
  },
  {
    question: "Fundamental Duties were added to the Constitution by which Amendment?",
    options: ["24th Amendment", "42nd Amendment", "44th Amendment", "52nd Amendment"],
    correctAnswer: "42nd Amendment",
    explanation: "Fundamental Duties were added by the 42nd Constitutional Amendment Act, 1976."
  },
  {
    question: "Who is the constitutional head of the Union Government?",
    options: ["Prime Minister", "President", "Vice President", "Chief Justice of India"],
    correctAnswer: "President",
    explanation: "The President of India is the executive head of state and constitutional head of the Union."
  },
  {
    question: "Who appoints the Prime Minister of India?",
    options: ["Parliament", "Supreme Court", "President", "Election Commission"],
    correctAnswer: "President",
    explanation: "Article 75 states that the Prime Minister shall be appointed by the President."
  },
  {
    question: "The Rajya Sabha is also known as the:",
    options: ["House of the People", "Upper House", "Lower House", "National Assembly"],
    correctAnswer: "Upper House",
    explanation: "Rajya Sabha is the Council of States, commonly referred to as the Upper House of Parliament."
  },
  {
    question: "What is the maximum strength of the Lok Sabha?",
    options: ["500", "545", "550", "552"],
    correctAnswer: "552",
    explanation: "The maximum sanctioned strength of Lok Sabha is 552 members."
  },
  {
    question: "Who is the guardian of the Indian Constitution?",
    options: ["President", "Parliament", "Supreme Court", "Prime Minister"],
    correctAnswer: "Supreme Court",
    explanation: "The Supreme Court of India is the final interpreter and guardian of the Constitution."
  },
  {
    question: "Which Article protects the Right to Life and Personal Liberty?",
    options: ["Article 15", "Article 19", "Article 21", "Article 25"],
    correctAnswer: "Article 21",
    explanation: "Article 21 states that no person shall be deprived of his life or personal liberty except according to procedure established by law."
  },
  {
    question: "Which body conducts elections in India?",
    options: ["UPSC", "Election Commission of India", "Parliament", "Supreme Court"],
    correctAnswer: "Election Commission of India",
    explanation: "The Election Commission of India (Article 324) conducts elections to Parliament, State Legislatures, and Presidential offices."
  },
  {
    question: "Which schedule deals with the languages recognized by the Constitution?",
    options: ["Sixth Schedule", "Seventh Schedule", "Eighth Schedule", "Ninth Schedule"],
    correctAnswer: "Eighth Schedule",
    explanation: "The Eighth Schedule lists 22 official recognized languages."
  },
  {
    question: "How many schedules are there in the Indian Constitution at present?",
    options: ["10", "11", "12", "13"],
    correctAnswer: "12",
    explanation: "Originally 8, the Constitution currently features 12 Schedules."
  },
  {
    question: "The anti-defection law is contained in which Schedule?",
    options: ["Seventh Schedule", "Eighth Schedule", "Ninth Schedule", "Tenth Schedule"],
    correctAnswer: "Tenth Schedule",
    explanation: "The 10th Schedule (added by 52nd Amendment, 1985) details the Anti-Defection Law."
  },
  {
    question: "Which amendment lowered the voting age from 21 to 18 years?",
    options: ["42nd Amendment", "44th Amendment", "61st Amendment", "73rd Amendment"],
    correctAnswer: "61st Amendment",
    explanation: "The 61st Constitutional Amendment Act, 1988 lowered the voting age from 21 to 18."
  },
  {
    question: "Which constitutional amendment introduced Panchayati Raj institutions?",
    options: ["42nd Amendment", "61st Amendment", "73rd Amendment", "74th Amendment"],
    correctAnswer: "73rd Amendment",
    explanation: "The 73rd Amendment Act, 1992 granted constitutional status to Panchayati Raj institutions."
  }
];

const seedIndianConstitution = async () => {
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas successfully!\n');

    // 1. Find General Knowledge Category
    let gkCategory = await Category.findOne({ slug: 'general-knowledge' });
    if (!gkCategory) {
      gkCategory = await Category.findOne({ name: /general/i });
    }
    const teacherUser = await User.findOne({ role: 'teacher' });

    // 2. Upsert Indian Constitution Exam
    const examDoc = await Exam.findOneAndUpdate(
      { title: 'Indian Constitution' },
      {
        title: 'Indian Constitution',
        subject: 'General Knowledge',
        category: gkCategory ? gkCategory._id : null,
        description: 'Comprehensive 35-minute assessment covering the Preamble, Fundamental Rights & Duties, DPSP, Parliament, President, Judiciary, Amendments, and Schedules.',
        duration: 35,
        totalMarks: 100,
        passingMarks: 40,
        difficulty: 'medium',
        status: 'published',
        instructions: 'Each question carries 5 marks. Select the single best answer for each question. Maintain continuous fullscreen mode throughout.',
        teacher: teacherUser ? teacherUser._id : null,
        questionCount: 20
      },
      { upsert: true, new: true }
    );

    console.log(`✓ Indian Constitution Exam Upserted (ID: ${examDoc._id})`);

    // 3. Clear existing questions for Indian Constitution
    await Question.deleteMany({ exam: examDoc._id });

    // 4. Insert the 20 MCQs
    const questionsToInsert = constitutionMCQs.map(q => ({
      exam: examDoc._id,
      category: gkCategory ? gkCategory._id : null,
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

    console.log(`✓ Successfully seeded ${totalQs} MCQs for Indian Constitution Exam!`);
    console.log('====================================================');
    console.log('🎉 INDIAN CONSTITUTION EXAM SEEDING COMPLETE');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Indian Constitution exam:', error);
    process.exit(1);
  }
};

seedIndianConstitution();
