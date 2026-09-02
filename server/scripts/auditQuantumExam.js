const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');

dotenv.config({ path: './.env' });

const auditQuantumExam = async () => {
  try {
    console.log('🔍 Connecting to MongoDB for Quantum Exam Audit...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    
    // 1. Find all exams matching the title
    const quantumExams = await Exam.find({ title: /Quantum Computing/i });
    console.log(`📌 Found ${quantumExams.length} Quantum Exam document(s):`);

    quantumExams.forEach(e => {
      console.log(`   - ID: ${e._id} | Subject: "${e.subject}" | Status: ${e.status} | Created: ${e.createdAt}`);
    });

    if (quantumExams.length === 0) {
      console.log('❌ No Quantum exam found!');
      process.exit(1);
    }

    // Keep the latest/canonical exam ID
    const canonicalExam = quantumExams[quantumExams.length - 1];
    console.log(`\n👑 Canonical Quantum Exam ID selected: ${canonicalExam._id}`);

    // Check questions linked to all Quantum exam IDs
    const examIds = quantumExams.map(e => e._id);
    const questionsLinked = await Question.find({ exam: { $in: examIds } });
    console.log(`❓ Total questions linked across all Quantum Exam IDs: ${questionsLinked.length}`);

    // If there are duplicate Quantum exam documents, delete old ones
    if (quantumExams.length > 1) {
      const duplicateIds = quantumExams.filter(e => e._id.toString() !== canonicalExam._id.toString()).map(e => e._id);
      console.log(`🧹 Cleaning up ${duplicateIds.length} duplicate exam records:`, duplicateIds);
      
      // Update any questions referencing old duplicate exam IDs to point to canonicalExam._id
      const relinkResult = await Question.updateMany(
        { exam: { $in: duplicateIds } },
        { $set: { exam: canonicalExam._id } }
      );
      console.log(`🔄 Relinked ${relinkResult.modifiedCount} questions to canonical Exam ID.`);

      // Delete duplicate exam records
      await Exam.deleteMany({ _id: { $in: duplicateIds } });
      console.log('🗑️ Deleted duplicate exam records.');
    }

    // Verify questions linked to canonical exam
    const canonicalQuestionsCount = await Question.countDocuments({ exam: canonicalExam._id });
    console.log(`\n✅ Final Question Count linked to canonical Exam (${canonicalExam._id}): ${canonicalQuestionsCount}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Audit error:', err);
    process.exit(1);
  }
};

auditQuantumExam();
