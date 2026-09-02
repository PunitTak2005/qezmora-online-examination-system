const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

const grammarMCQs = [
  {
    question: "Choose the correct sentence.",
    options: ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She gone to school every day."],
    correctAnswer: "She goes to school every day.",
    explanation: "Third-person singular subject ('She') takes the verb suffix '-es' in simple present tense ('goes')."
  },
  {
    question: "Fill in the blank.\n\nI _____ my homework before dinner yesterday.",
    options: ["finish", "finished", "finishes", "finishing"],
    correctAnswer: "finished",
    explanation: "'Yesterday' signals simple past tense, requiring the past form 'finished'."
  },
  {
    question: "Choose the correct article.\n\nShe bought _____ umbrella because it was raining.",
    options: ["a", "an", "the", "no article"],
    correctAnswer: "an",
    explanation: "'Umbrella' begins with a vowel sound, requiring the indefinite article 'an'."
  },
  {
    question: "Which sentence is grammatically correct?",
    options: ["The team are winning.", "The team is winning.", "The team were winning.", "The team have winning."],
    correctAnswer: "The team is winning.",
    explanation: "'The team' is a collective noun treated as a singular unit, taking the singular verb 'is'."
  },
  {
    question: "Fill in the blank.\n\nThe keys are _____ the table.",
    options: ["in", "on", "at", "into"],
    correctAnswer: "on",
    explanation: "'On' is the correct preposition indicating surface location."
  },
  {
    question: "Choose the correct pronoun.\n\nNeither John nor Sarah brought _____ notebook.",
    options: ["his", "her", "their", "its"],
    correctAnswer: "his",
    explanation: "Standard formal grammar defaults to singular antecedent agreement."
  },
  {
    question: "Which sentence uses the Present Perfect tense correctly?",
    options: ["I have ate breakfast.", "I have eaten breakfast.", "I has eaten breakfast.", "I had eating breakfast."],
    correctAnswer: "I have eaten breakfast.",
    explanation: "Present perfect tense is formed using 'have' + past participle ('eaten')."
  },
  {
    question: "Choose the correct modal verb.\n\nYou _____ wear a seatbelt while driving.",
    options: ["might", "should", "must", "can"],
    correctAnswer: "must",
    explanation: "'Must' indicates strict legal or physical obligation."
  },
  {
    question: "Fill in the blank.\n\nIf I _____ more time, I would learn Spanish.",
    options: ["have", "had", "has", "having"],
    correctAnswer: "had",
    explanation: "Second conditional structures require simple past ('had') in the 'if' clause."
  },
  {
    question: "Choose the correct passive voice.\n\n\"They completed the project.\"",
    options: ["The project completed.", "The project was completed.", "The project has completed.", "The project is completed yesterday."],
    correctAnswer: "The project was completed.",
    explanation: "Simple past passive voice formula: object + was/were + past participle ('was completed')."
  },
  {
    question: "Which sentence is punctuated correctly?",
    options: ["Yes I will come tomorrow.", "Yes, I will come tomorrow.", "Yes I, will come tomorrow.", "Yes; I will, come tomorrow."],
    correctAnswer: "Yes, I will come tomorrow.",
    explanation: "An introductory word like 'Yes' must be followed by a comma."
  },
  {
    question: "Choose the correct comparative form.\n\nThis book is _____ than the previous one.",
    options: ["interesting", "more interesting", "most interesting", "interestinger"],
    correctAnswer: "more interesting",
    explanation: "Multi-syllable adjectives form comparatives using 'more'."
  },
  {
    question: "Fill in the blank.\n\nBy next year, she _____ her degree.",
    options: ["completes", "completed", "will have completed", "has completed"],
    correctAnswer: "will have completed",
    explanation: "'By next year' signals Future Perfect tense ('will have completed')."
  },
  {
    question: "Identify the correctly spelled word.",
    options: ["Recieve", "Receive", "Receeve", "Receve"],
    correctAnswer: "Receive",
    explanation: "Follows the rule 'I before E except after C'."
  },
  {
    question: "Choose the correct indirect speech.\n\nHe said, \"I am busy.\"",
    options: ["He said that I was busy.", "He said that he was busy.", "He says that he is busy.", "He said that he is busy."],
    correctAnswer: "He said that he was busy.",
    explanation: "Reported speech shifts present tense 'am' to past tense 'was' and pronoun 'I' to 'he'."
  },
  {
    question: "Fill in the blank.\n\nEveryone _____ invited to the meeting.",
    options: ["are", "were", "is", "have"],
    correctAnswer: "is",
    explanation: "Indefinite pronouns like 'Everyone' take singular verbs ('is')."
  },
  {
    question: "Which sentence is correct?",
    options: ["There is many books.", "There are many books.", "There was many books.", "There have many books."],
    correctAnswer: "There are many books.",
    explanation: "Plural noun 'books' requires the plural verb 'are'."
  },
  {
    question: "Choose the correct conjunction.\n\nI stayed home _____ it was raining.",
    options: ["but", "because", "although", "unless"],
    correctAnswer: "because",
    explanation: "'Because' introduces the cause/reason for staying home."
  },
  {
    question: "Fill in the blank.\n\nShe is one of the _____ students in the class.",
    options: ["intelligent", "more intelligent", "most intelligent", "intelligently"],
    correctAnswer: "most intelligent",
    explanation: "Superlative form 'most intelligent' is required after 'the'."
  },
  {
    question: "Which sentence is grammatically correct?",
    options: ["He doesn't likes coffee.", "He don't like coffee.", "He doesn't like coffee.", "He not like coffee."],
    correctAnswer: "He doesn't like coffee.",
    explanation: "Third-person singular negative uses 'doesn't' followed by the base verb form 'like'."
  }
];

const seedEnglishGrammar = async () => {
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas successfully!\n');

    // 1. Find English Category
    const englishCategory = await Category.findOne({ slug: 'english' });
    const teacherUser = await User.findOne({ role: 'teacher' });

    // 2. Upsert English Grammar Exam
    const examDoc = await Exam.findOneAndUpdate(
      { title: 'English Grammar' },
      {
        title: 'English Grammar',
        subject: 'English',
        category: englishCategory ? englishCategory._id : null,
        description: 'Fundamental 25-minute grammar assessment covering tenses, subject-verb agreement, articles, prepositions, active/passive voice, direct/indirect speech, and sentence correction.',
        duration: 25,
        totalMarks: 100,
        passingMarks: 40,
        difficulty: 'easy',
        status: 'published',
        instructions: 'Each question carries 5 marks. Select the single best answer for each question.',
        teacher: teacherUser ? teacherUser._id : null,
        questionCount: 20
      },
      { upsert: true, new: true }
    );

    console.log(`✓ English Grammar Exam Upserted (ID: ${examDoc._id})`);

    // 3. Clear existing questions for English Grammar
    await Question.deleteMany({ exam: examDoc._id });

    // 4. Insert the 20 MCQs
    const questionsToInsert = grammarMCQs.map(q => ({
      exam: examDoc._id,
      category: englishCategory ? englishCategory._id : null,
      question: q.question,
      type: 'mcq',
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: 5,
      difficulty: 'easy',
      explanation: q.explanation,
      status: 'active'
    }));

    await Question.insertMany(questionsToInsert);

    // 5. Update Question Count on Exam
    const totalQs = await Question.countDocuments({ exam: examDoc._id });
    examDoc.questionCount = totalQs;
    await examDoc.save();

    console.log(`✓ Successfully seeded ${totalQs} MCQs for English Grammar Exam!`);
    console.log('====================================================');
    console.log('🎉 ENGLISH GRAMMAR EXAM SEEDING COMPLETE');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding English Grammar exam:', error);
    process.exit(1);
  }
};

seedEnglishGrammar();
