const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const Contact = require('../models/Contact');
const Category = require('../models/Category');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const build12MonthsTrend = (attemptsList) => {
  const currentMonthIdx = new Date().getMonth();
  const activeMonths = ALL_MONTHS.slice(0, currentMonthIdx + 1);
  const monthBucket = activeMonths.map(m => ({ month: m, totalScore: 0, count: 0 }));

  attemptsList.forEach(a => {
    if (a.submittedAt || a.createdAt) {
      const date = new Date(a.submittedAt || a.createdAt);
      const mIdx = date.getMonth();
      if (mIdx >= 0 && mIdx <= currentMonthIdx) {
        monthBucket[mIdx].totalScore += (a.percentage || 0);
        monthBucket[mIdx].count += 1;
      }
    }
  });

  return monthBucket.map(item => ({
    month: item.month,
    averageScore: item.count > 0 ? Number((item.totalScore / item.count).toFixed(1)) : 0,
    attempts: item.count
  }));
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const teachers = await User.countDocuments({ role: 'teacher' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    const exams = await Exam.countDocuments();
    const questions = await Question.countDocuments();
    const attemptsList = await Attempt.find();
    
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ status: 'Unread' });

    // Calculate pass rate
    const completedAttempts = attemptsList;
    const passedCount = completedAttempts.filter(a => a.passed).length;
    const passRate = completedAttempts.length > 0 
      ? ((passedCount / completedAttempts.length) * 100).toFixed(1) 
      : 0;

    const userGrowth = [
      { name: 'Mon', users: Math.max(1, Math.floor(totalUsers * 0.4)) },
      { name: 'Tue', users: Math.max(2, Math.floor(totalUsers * 0.5)) },
      { name: 'Wed', users: Math.max(3, Math.floor(totalUsers * 0.65)) },
      { name: 'Thu', users: Math.max(4, Math.floor(totalUsers * 0.75)) },
      { name: 'Fri', users: Math.max(5, Math.floor(totalUsers * 0.85)) },
      { name: 'Sat', users: Math.max(6, Math.floor(totalUsers * 0.95)) },
      { name: 'Sun', users: totalUsers }
    ];

    const passVsFail = [
      { name: 'Passed', value: passedCount },
      { name: 'Failed', value: completedAttempts.length - passedCount }
    ];

    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name role createdAt');
    const recentActivity = recentUsers.map(u => ({
      id: u._id,
      user: u.name,
      action: `New ${u.role} registered`,
      time: u.createdAt
    }));

    const monthlyTrend = build12MonthsTrend(attemptsList);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        students,
        teachers,
        admins,
        exams,
        questions,
        attempts: attemptsList.length,
        totalMessages,
        unreadMessages,
        passRate: Number(passRate),
        userGrowth,
        passVsFail,
        recentActivity,
        monthlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentStats = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ student: req.user.id });
    
    let totalScore = 0;
    let passCount = 0;
    let failCount = 0;
    let maxScore = 0;
    
    attempts.forEach(a => {
      const pct = a.percentage || 0;
      totalScore += pct;
      if (pct > maxScore) maxScore = pct;
      if (a.passed) {
        passCount++;
      } else {
        failCount++;
      }
    });
    
    const avgScore = attempts.length > 0 ? Number((totalScore / attempts.length).toFixed(2)) : 0;
    const passRate = attempts.length > 0 ? Math.round((passCount / attempts.length) * 100) : 0;
    const monthlyTrend = build12MonthsTrend(attempts);

    res.status(200).json({
      success: true,
      data: {
        examsTaken: attempts.length,
        totalAttempts: attempts.length,
        passedExams: passCount,
        failedExams: failCount,
        passCount,
        failCount,
        passRate,
        avgScore,
        bestScore: Math.round(maxScore),
        monthlyTrend,
        passFailData: [
          { name: 'Pass', value: passCount },
          { name: 'Fail', value: failCount }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTeacherStats = async (req, res, next) => {
  try {
    const exams = await Exam.find({ teacher: req.user.id });
    const examIds = exams.map(e => e._id);
    
    const attempts = await Attempt.find({ exam: { $in: examIds } }).populate('exam', 'title');
    
    const uniqueStudents = new Set();
    let totalScore = 0;
    const attemptsByExam = {};

    attempts.forEach(attempt => {
      uniqueStudents.add(attempt.student.toString());
      totalScore += attempt.percentage;
      
      const examTitle = attempt.exam?.title || 'Unknown Exam';
      if (!attemptsByExam[examTitle]) {
        attemptsByExam[examTitle] = 0;
      }
      attemptsByExam[examTitle]++;
    });

    const attemptsData = Object.keys(attemptsByExam).map(title => ({
      name: title,
      attempts: attemptsByExam[title]
    })).slice(0, 5);

    const avgScore = attempts.length > 0 ? (totalScore / attempts.length).toFixed(1) : 0;
    const monthlyTrend = build12MonthsTrend(attempts);

    res.status(200).json({
      success: true,
      data: {
        totalExams: exams.length,
        publishedExams: exams.filter(e => e.status === 'published').length,
        totalStudents: uniqueStudents.size,
        avgScore: Number(avgScore),
        attemptsData,
        trendData: monthlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete existing avatar file from disk if present to prevent orphaned files
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (unlinkErr) {
          console.error('Failed to delete previous avatar file:', unlinkErr);
        }
      }
    }

    // Determine target subfolder based on request or default to profile
    const relativePath = `/uploads/profile/${req.file.filename}`;
    user.avatar = relativePath;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      avatar: user.avatar,
      user,
      data: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

exports.removeAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete file from disk if present
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (unlinkErr) {
          console.error('Failed to delete avatar file:', unlinkErr);
        }
      }
    }

    user.avatar = '';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo removed successfully',
      avatar: '',
      user,
      data: ''
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    let roleStats = {};

    try {
      if (user.role === 'student') {
        const attempts = await Attempt.find({ student: user._id });
        let totalScore = 0;
        let passedExams = 0;
        attempts.forEach(a => {
          totalScore += a.percentage || 0;
          if (a.passed) passedExams++;
        });
        const avgScore = attempts.length ? (totalScore / attempts.length).toFixed(1) : 0;
        roleStats = {
          examsAttempted: attempts.length,
          avgScore: Number(avgScore),
          passedExams
        };
      } else if (user.role === 'teacher') {
        const exams = await Exam.find({ teacher: user._id });
        const examIds = exams.map(e => e._id);
        const questionsCount = await Question.countDocuments({ exam: { $in: examIds } });
        const attempts = await Attempt.find({ exam: { $in: examIds } });
        const validStudentIds = attempts.filter(a => a.student).map(a => a.student.toString());
        const uniqueStudents = new Set(validStudentIds);
        roleStats = {
          examsCreated: exams.length,
          questionsAdded: questionsCount,
          studentsReached: uniqueStudents.size
        };
      } else if (user.role === 'admin') {
        const [totalUsers, totalCategories, totalExams] = await Promise.all([
          User.countDocuments(),
          Category.countDocuments(),
          Exam.countDocuments()
        ]);
        roleStats = {
          usersManaged: totalUsers,
          categoriesManaged: totalCategories,
          systemExams: totalExams
        };
      }
    } catch (statsErr) {
      console.error('Non-fatal stats aggregation error in getUserProfile:', statsErr);
      roleStats = {};
    }

    res.status(200).json({
      success: true,
      user,
      data: {
        user,
        roleStats
      }
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, phone, college, course, address, bio, preferences, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (email !== undefined) fieldsToUpdate.email = email;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (college !== undefined) fieldsToUpdate.college = college;
    if (course !== undefined) fieldsToUpdate.course = course;
    if (address !== undefined) fieldsToUpdate.address = address;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;
    if (preferences !== undefined) fieldsToUpdate.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
      data: user
    });
  } catch (error) {
    if (error.code === 11000) {
      const customError = new Error('Email address is already in use by another account');
      customError.statusCode = 400;
      return next(customError);
    }
    next(error);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
