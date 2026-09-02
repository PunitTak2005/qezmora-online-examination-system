const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const ExamViolation = require('../models/ExamViolation');

dotenv.config({ path: './.env' });

const seedViolations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('🛡️ Seeding sample Exam Security Violations...');

    const violationsCount = await ExamViolation.countDocuments();
    if (violationsCount === 0) {
      const student = await User.findOne({ role: 'student' });
      const exam = await Exam.findOne({ status: 'published' });

      if (student && exam) {
        await ExamViolation.create([
          {
            student: student._id,
            exam: exam._id,
            type: 'tab_switch',
            warningNumber: 2,
            metadata: { details: 'Tab switched to external browser window' },
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            student: student._id,
            exam: exam._id,
            type: 'fullscreen_exit',
            warningNumber: 1,
            metadata: { details: 'Exited secure fullscreen mode via ESC key' },
            timestamp: new Date(Date.now() - 7200000)
          },
          {
            student: student._id,
            exam: exam._id,
            type: 'window_blur',
            warningNumber: 1,
            metadata: { details: 'Window lost focus for 12 seconds' },
            timestamp: new Date(Date.now() - 10800000)
          }
        ]);
        console.log('✅ Created 3 sample security violations for Admin Integrity Dashboard.');
      }
    } else {
      console.log(`✅ ${violationsCount} security violations already exist in database.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding violations:', err);
    process.exit(1);
  }
};

seedViolations();
