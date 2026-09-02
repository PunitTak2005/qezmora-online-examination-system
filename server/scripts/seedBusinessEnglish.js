const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

const businessEnglishMCQs = [
  {
    question: "Which greeting is most appropriate for a formal business email?",
    options: ["Hey buddy", "What's up?", "Dear Mr. Johnson", "Yo!"],
    correctAnswer: "Dear Mr. Johnson",
    explanation: "'Dear Mr. Johnson' is the standard polite and formal salutation in business correspondence."
  },
  {
    question: "What does \"ASAP\" mean in business communication?",
    options: ["As Soon As Possible", "Always Send All Papers", "After Several Approved Processes", "Ask Someone About Payment"],
    correctAnswer: "As Soon As Possible",
    explanation: "ASAP stands for 'As Soon As Possible', indicating urgency in workplace communications."
  },
  {
    question: "Which sentence is the most professional?",
    options: ["Send me the file now.", "I need the file immediately.", "Could you please send me the file at your earliest convenience?", "Hurry up and send it."],
    correctAnswer: "Could you please send me the file at your earliest convenience?",
    explanation: "'Could you please send me the file at your earliest convenience?' uses polite modal verbs and professional business phrasing."
  },
  {
    question: "What is the purpose of an agenda in a meeting?",
    options: ["To entertain attendees", "To outline discussion topics", "To record attendance", "To announce salaries"],
    correctAnswer: "To outline discussion topics",
    explanation: "A meeting agenda outlines the key topics, goals, and schedule for discussion."
  },
  {
    question: "Which word best completes the sentence? \"The client requested a detailed ______ before approving the project.\"",
    options: ["Complaint", "Proposal", "Rumor", "Greeting"],
    correctAnswer: "Proposal",
    explanation: "A 'proposal' outlines project scope, timelines, costs, and terms for client approval."
  },
  {
    question: "What does \"follow up\" mean in business communication?",
    options: ["Cancel a meeting", "Contact someone again regarding a previous discussion", "Ignore an email", "Start a new project"],
    correctAnswer: "Contact someone again regarding a previous discussion",
    explanation: "Following up means re-contacting a colleague or client to check on the status of a previous item."
  },
  {
    question: "Which phrase politely disagrees during a meeting?",
    options: ["You're completely wrong.", "That's ridiculous.", "I see your point, but I'd like to suggest another approach.", "Stop talking."],
    correctAnswer: "I see your point, but I'd like to suggest another approach.",
    explanation: "Acknowledging the other speaker's point before offering an alternative is the standard professional disagreement etiquette."
  },
  {
    question: "Which is the correct closing for a formal email?",
    options: ["Bye", "Cheers", "Kind regards", "See ya"],
    correctAnswer: "Kind regards",
    explanation: "'Kind regards' or 'Sincerely' are universally accepted formal email sign-offs."
  },
  {
    question: "What does \"deadline\" refer to?",
    options: ["A meeting location", "The final date for completing work", "A company holiday", "A salary increase"],
    correctAnswer: "The final date for completing work",
    explanation: "A deadline is the strict target time or date by which a task or deliverable must be completed."
  },
  {
    question: "Which sentence uses the correct business tone?",
    options: ["Fix this ASAP.", "Can you fix this?", "Could you please resolve this issue by tomorrow?", "Why haven't you fixed it?"],
    correctAnswer: "Could you please resolve this issue by tomorrow?",
    explanation: "It combines polite phrasing ('Could you please') with a clear deadline ('by tomorrow')."
  },
  {
    question: "What is the meaning of \"CC\" in an email?",
    options: ["Company Contact", "Carbon Copy", "Client Confirmation", "Customer Call"],
    correctAnswer: "Carbon Copy",
    explanation: "CC stands for 'Carbon Copy', sending an informational copy of an email to secondary recipients."
  },
  {
    question: "Which word best describes effective workplace communication?",
    options: ["Ambiguous", "Clear", "Confusing", "Informal"],
    correctAnswer: "Clear",
    explanation: "Clarity ensures messages are understood without confusion or misinterpretation."
  },
  {
    question: "What should you do before sending a professional email?",
    options: ["Ignore spelling errors.", "Check grammar and attachments.", "Use emojis excessively.", "Write in all capital letters."],
    correctAnswer: "Check grammar and attachments.",
    explanation: "Proofreading grammar, tone, spelling, and attachments ensures accuracy and professionalism."
  },
  {
    question: "Which phrase is most suitable when requesting feedback?",
    options: ["Tell me if it's bad.", "I'd appreciate your feedback on this report.", "Fix it yourself.", "Whatever you think."],
    correctAnswer: "I'd appreciate your feedback on this report.",
    explanation: "'I'd appreciate your feedback on this report' expresses gratitude and professionalism."
  },
  {
    question: "What does \"B2B\" stand for?",
    options: ["Back to Business", "Business to Business", "Business to Buyer", "Buy to Business"],
    correctAnswer: "Business to Business",
    explanation: "B2B stands for 'Business to Business', commercial transactions between two companies."
  },
  {
    question: "Which sentence is grammatically correct?",
    options: ["The team have completed the report.", "The team has completed the report.", "The team completing the report.", "The team complete the report yesterday."],
    correctAnswer: "The team has completed the report.",
    explanation: "'The team' is a collective singular noun in American business English taking 'has completed'."
  },
  {
    question: "What is the best response when you cannot meet a deadline?",
    options: ["Ignore the situation.", "Inform the manager promptly and propose a new timeline.", "Wait until someone asks.", "Blame a coworker."],
    correctAnswer: "Inform the manager promptly and propose a new timeline.",
    explanation: "Proactive communication and offering an alternative revised timeline is the professional protocol."
  },
  {
    question: "Which word is closest in meaning to \"negotiate\"?",
    options: ["Argue endlessly", "Discuss terms to reach an agreement", "Cancel a contract", "Reject an offer"],
    correctAnswer: "Discuss terms to reach an agreement",
    explanation: "Negotiation is a constructive discussion aimed at finding mutually acceptable terms."
  },
  {
    question: "What is the purpose of meeting minutes?",
    options: ["To advertise products", "To summarize decisions and action items", "To record employee salaries", "To create presentations"],
    correctAnswer: "To summarize decisions and action items",
    explanation: "Meeting minutes record official decisions, discussions, and assigned action items."
  },
  {
    question: "Which sentence is most appropriate for confirming a meeting?",
    options: ["Fine, I'll come.", "Okay.", "I confirm my attendance for tomorrow's meeting at 10:00 AM.", "Maybe I'll join."],
    correctAnswer: "I confirm my attendance for tomorrow's meeting at 10:00 AM.",
    explanation: "It explicitly confirms attendance, date, and exact meeting time with formal clarity."
  }
];

const seedBusinessEnglish = async () => {
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas successfully!\n');

    // 1. Find English Category
    const englishCategory = await Category.findOne({ slug: 'english' });
    const teacherUser = await User.findOne({ role: 'teacher' });

    // 2. Upsert Business English Exam
    const examDoc = await Exam.findOneAndUpdate(
      { title: 'Business English' },
      {
        title: 'Business English',
        subject: 'English',
        category: englishCategory ? englishCategory._id : null,
        description: 'Comprehensive 35-minute evaluation testing workplace communication, formal emails, meeting etiquette, negotiations, and business terminology.',
        duration: 35,
        totalMarks: 100,
        passingMarks: 40,
        difficulty: 'medium',
        status: 'published',
        instructions: 'Each question carries 5 marks. Maintain continuous fullscreen mode throughout the test.',
        teacher: teacherUser ? teacherUser._id : null,
        questionCount: 20
      },
      { upsert: true, new: true }
    );

    console.log(`✓ Business English Exam Upserted (ID: ${examDoc._id})`);

    // 3. Clear existing questions for Business English
    await Question.deleteMany({ exam: examDoc._id });

    // 4. Insert the 20 MCQs
    const questionsToInsert = businessEnglishMCQs.map(q => ({
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

    console.log(`✓ Successfully seeded ${totalQs} MCQs for Business English Exam!`);
    console.log('====================================================');
    console.log('🎉 BUSINESS ENGLISH EXAM SEEDING COMPLETE');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Business English exam:', error);
    process.exit(1);
  }
};

seedBusinessEnglish();
