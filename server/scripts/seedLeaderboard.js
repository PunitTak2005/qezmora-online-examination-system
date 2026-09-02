const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

dotenv.config({ path: './.env' });

const sampleStudents = [
  { name: 'Aarav Sharma', email: 'aarav@iitd.ac.in', college: 'IIT Delhi', course: 'Computer Science', totalScore: 286, avgPercentage: 94.7, exams: 15 },
  { name: 'Priya Verma', email: 'priya@nitt.edu', college: 'NIT Trichy', course: 'Electrical Engineering', totalScore: 278, avgPercentage: 93.8, exams: 14 },
  { name: 'Rohan Mehta', email: 'rohan@pilani.bits-pilani.ac.in', college: 'BITS Pilani', course: 'Information Systems', totalScore: 271, avgPercentage: 92.6, exams: 14 },
  { name: 'Neha Singh', email: 'neha@iitb.ac.in', college: 'IIT Bombay', course: 'Computer Science', totalScore: 264, avgPercentage: 91.9, exams: 13 },
  { name: 'Arjun Kapoor', email: 'arjun@iiit.ac.in', college: 'IIIT Hyderabad', course: 'AI & Data Science', totalScore: 258, avgPercentage: 90.8, exams: 13 },
  { name: 'Kavya Nair', email: 'kavya@vit.ac.in', college: 'VIT Vellore', course: 'Software Engineering', totalScore: 251, avgPercentage: 89.5, exams: 12 },
  { name: 'Aditya Rao', email: 'aditya@srmist.edu.in', college: 'SRM University', course: 'Information Technology', totalScore: 244, avgPercentage: 88.9, exams: 12 },
  { name: 'Ishita Jain', email: 'ishita@dtu.ac.in', college: 'DTU Delhi', course: 'Mathematics & Computing', totalScore: 238, avgPercentage: 88.1, exams: 11 },
  { name: 'Rahul Joshi', email: 'rahul@technonjr.org', college: 'Techno NJR Institute', course: 'Computer Science', totalScore: 232, avgPercentage: 87.4, exams: 11 },
  { name: 'Sneha Patel', email: 'sneha@nirmauni.ac.in', college: 'Nirma University', course: 'Electronics Engineering', totalScore: 226, avgPercentage: 86.8, exams: 10 },
  { name: 'Vivek Kumar', email: 'vivek@manipal.edu', college: 'Manipal Institute', course: 'Mechanical Engineering', totalScore: 220, avgPercentage: 85.9, exams: 10 },
  { name: 'Ananya Roy', email: 'ananya@iitm.ac.in', college: 'IIT Madras', course: 'Aerospace Engineering', totalScore: 215, avgPercentage: 85.2, exams: 9 },
  { name: 'Siddharth Malhotra', email: 'siddharth@rvce.edu.in', college: 'RV College Bangalore', course: 'Computer Science', totalScore: 210, avgPercentage: 84.6, exams: 9 },
  { name: 'Tanvi Gupta', email: 'tanvi@thapar.edu', college: 'Thapar Institute', course: 'Biotechnology', totalScore: 204, avgPercentage: 83.9, exams: 9 },
  { name: 'Devendra Singh', email: 'devendra@mnit.ac.in', college: 'MNIT Jaipur', course: 'Civil Engineering', totalScore: 198, avgPercentage: 83.1, exams: 8 },
  { name: 'Pooja Reddy', email: 'pooja@jntu.ac.in', college: 'JNTU Hyderabad', course: 'Information Technology', totalScore: 193, avgPercentage: 82.5, exams: 8 },
  { name: 'Harsh Vardhan', email: 'harsh@nsut.ac.in', college: 'NSUT Delhi', course: 'Instrumentation', totalScore: 188, avgPercentage: 81.7, exams: 8 },
  { name: 'Riya Sen', email: 'riya@jadavpuruniversity.in', college: 'Jadavpur University', course: 'Chemical Engineering', totalScore: 182, avgPercentage: 81.0, exams: 7 },
  { name: 'Yash Agarwal', email: 'yash@pes.edu', college: 'PES University', course: 'Computer Science', totalScore: 177, avgPercentage: 80.3, exams: 7 },
  { name: 'Meera Nambiar', email: 'meera@cusat.ac.in', college: 'CUSAT Kochi', course: 'Marine Engineering', totalScore: 171, avgPercentage: 79.5, exams: 7 },
  { name: 'Kshitij Saxena', email: 'kshitij@iitr.ac.in', college: 'IIT Roorkee', course: 'Physics', totalScore: 166, avgPercentage: 78.8, exams: 6 },
  { name: 'Divya Iyer', email: 'divya@psgtech.ac.in', college: 'PSG Tech Coimbatore', course: 'Robotics', totalScore: 160, avgPercentage: 78.1, exams: 6 },
  { name: 'Manan Shah', email: 'manan@daiict.ac.in', college: 'DA-IICT Gandhinagar', course: 'ICT', totalScore: 155, avgPercentage: 77.4, exams: 6 },
  { name: 'Sanjana Deshmukh', email: 'sanjana@coep.ac.in', college: 'COEP Pune', course: 'Production Engineering', totalScore: 149, avgPercentage: 76.6, exams: 5 },
  { name: 'Tarun Chawla', email: 'tarun@pec.ac.in', college: 'PEC Chandigarh', course: 'Materials Engineering', totalScore: 144, avgPercentage: 75.9, exams: 5 },
  { name: 'Shreya Bose', email: 'shreya@heritage.edu.in', college: 'Heritage Tech Kolkata', course: 'Electronics', totalScore: 138, avgPercentage: 75.1, exams: 5 },
  { name: 'Nikhil Bansal', email: 'nikhil@bmsce.ac.in', college: 'BMSCE Bangalore', course: 'Cyber Security', totalScore: 132, avgPercentage: 74.3, exams: 4 },
  { name: 'Archana Hegde', email: 'archana@nitk.edu.in', college: 'NIT Surathkal', course: 'Mining Engineering', totalScore: 126, avgPercentage: 73.5, exams: 4 },
  { name: 'Pranav Kulkarni', email: 'pranav@vjti.ac.in', college: 'VJTI Mumbai', course: 'Textile Technology', totalScore: 120, avgPercentage: 72.8, exams: 4 },
  { name: 'Deepa Menon', email: 'deepa@cet.ac.in', college: 'CET Trivandrum', course: 'Architecture', totalScore: 114, avgPercentage: 71.9, exams: 4 }
];

const seedLeaderboard = async () => {
  try {
    console.log('🏆 Connecting to MongoDB for Leaderboard Seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');

    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const publishedExams = await Exam.find({ status: 'published' });

    if (publishedExams.length === 0) {
      console.error('❌ No published exams found to seed attempts against!');
      process.exit(1);
    }

    console.log(`📌 Found ${publishedExams.length} published exams.`);
    let createdCount = 0;

    for (const studentData of sampleStudents) {
      let user = await User.findOne({ email: studentData.email });
      if (!user) {
        user = await User.create({
          name: studentData.name,
          email: studentData.email,
          password: hashedPassword,
          role: 'student',
          college: studentData.college,
          course: studentData.course
        });
      }

      // Check if student already has submitted attempts
      const existingAttempts = await Attempt.countDocuments({ student: user._id, status: 'submitted' });
      if (existingAttempts === 0) {
        // Create sample submitted attempts
        const scorePerExam = Math.round(studentData.totalScore / studentData.exams);
        for (let i = 0; i < studentData.exams; i++) {
          const targetExam = publishedExams[i % publishedExams.length];
          const timeAgoDays = Math.floor(Math.random() * 25);
          const submittedAt = new Date(Date.now() - (timeAgoDays * 24 * 60 * 60 * 1000));

          await Attempt.create({
            student: user._id,
            exam: targetExam._id,
            status: 'submitted',
            score: scorePerExam,
            totalMarks: 100,
            percentage: studentData.avgPercentage,
            passed: studentData.avgPercentage >= 40,
            timeTaken: 1200 + Math.floor(Math.random() * 600),
            submittedAt
          });
        }
        createdCount++;
      }
    }

    console.log(`🎉 Successfully seeded ${createdCount} sample student accounts and submitted attempts for Leaderboard!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding leaderboard:', err);
    process.exit(1);
  }
};

seedLeaderboard();
