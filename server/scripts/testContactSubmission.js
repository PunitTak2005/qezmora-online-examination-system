const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Contact = require('../models/Contact');

const testMessages = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    subject: 'General Inquiry',
    message: 'Hello Qezmora team, I would like to inquire about institutional licenses for our college.',
    status: 'Unread'
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    subject: 'Exam Support',
    message: 'Hi, I experienced a minor connection hiccup during the Python Programming exam. Can you check my attempt status?',
    status: 'Unread'
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul.mehta@example.com',
    subject: 'Technical Issue',
    message: 'Greetings! The timer displayed correctly on desktop but had a small rendering delay on mobile web browser.',
    status: 'Read'
  }
];

const verifyContactSystem = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineexam';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    for (const msgData of testMessages) {
      const existing = await Contact.findOne({ email: msgData.email, subject: msgData.subject });
      if (!existing) {
        await Contact.create(msgData);
        console.log(`+ Created test message from ${msgData.name} [${msgData.subject}]`);
      } else {
        console.log(`= Message from ${msgData.name} already exists.`);
      }
    }

    const totalCount = await Contact.countDocuments();
    const unreadCount = await Contact.countDocuments({ status: 'Unread' });

    console.log('\n========================================');
    console.log('    CONTACT SYSTEM VERIFICATION SUMMARY');
    console.log('========================================');
    console.log(`Total Messages in MongoDB : ${totalCount}`);
    console.log(`Unread Messages          : ${unreadCount}`);
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
};

verifyContactSystem();
