const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

dotenv.config({ path: './.env' });

const cleanStaleAttempts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('🧹 Auditing in-progress attempts for stale question references...');

    const attempts = await Attempt.find({ status: 'in-progress' }).populate('generatedQuestions.question');
    let staleCount = 0;

    for (const attempt of attempts) {
      const hasNullQuestion = attempt.generatedQuestions.some(g => !g.question);
      if (hasNullQuestion) {
        console.log(`  - Deleting stale in-progress attempt ${attempt._id} for exam ${attempt.exam}`);
        await Attempt.deleteOne({ _id: attempt._id });
        staleCount++;
      }
    }

    console.log(`✅ Cleaned up ${staleCount} stale in-progress attempt(s).`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning stale attempts:', err);
    process.exit(1);
  }
};

cleanStaleAttempts();
