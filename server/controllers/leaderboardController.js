const Attempt = require('../models/Attempt');
const User = require('../models/User');
const mongoose = require('mongoose');

// Utility to calculate start date based on time period
const getStartDate = (period) => {
  const now = new Date();
  if (period === 'weekly') {
    return new Date(now.setDate(now.getDate() - now.getDay()));
  }
  if (period === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null; // All-time
};

exports.getOverallLeaderboard = async (req, res, next) => {
  try {
    const { period, category, limit = 50, page = 1 } = req.query;
    
    // Build match criteria for attempts
    const matchStage = { status: 'submitted' };
    
    const startDate = getStartDate(period);
    if (startDate) {
      matchStage.submittedAt = { $gte: startDate };
    }

    // Pipeline to calculate leaderboard
    const pipeline = [
      { $match: matchStage },
      // Note: If category filter is needed, we'd need to lookup the Exam first.
      // For now, overall points logic:
      {
        $group: {
          _id: '$student',
          totalScore: { $sum: '$score' },
          avgPercentage: { $avg: '$percentage' },
          examsCompleted: { $sum: 1 },
          avgTimeTaken: { $avg: '$timeTaken' }
        }
      },
      // Sort logic: total score first, then average percentage, then exams completed
      {
        $sort: {
          totalScore: -1,
          avgPercentage: -1,
          examsCompleted: -1,
          avgTimeTaken: 1
        }
      },
      {
        $limit: parseInt(limit) * parseInt(page) // Pagination logic later
      },
      // Lookup student details
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $unwind: '$studentDetails'
      },
      {
        $project: {
          _id: 1,
          totalScore: 1,
          avgPercentage: { $round: ['$avgPercentage', 2] },
          examsCompleted: 1,
          avgTimeTaken: { $round: ['$avgTimeTaken', 0] },
          student: {
            name: '$studentDetails.name',
            email: '$studentDetails.email',
            avatar: { $ifNull: ['$studentDetails.avatar', '$studentDetails.profileImage'] },
            college: '$studentDetails.college'
          }
        }
      }
    ];

    const leaderboard = await Attempt.aggregate(pipeline);

    // Add rank numbers
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (error) {
    next(error);
  }
};

exports.getExamLeaderboard = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const pipeline = [
      { $match: { exam: new mongoose.Types.ObjectId(examId), status: 'submitted' } },
      {
        $group: {
          _id: '$student',
          bestScore: { $max: '$score' },
          bestPercentage: { $max: '$percentage' },
          bestTime: { $min: '$timeTaken' }
        }
      },
      {
        $sort: { bestScore: -1, bestPercentage: -1, bestTime: 1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      { $unwind: '$studentDetails' },
      {
        $project: {
          _id: 1,
          score: '$bestScore',
          percentage: { $round: ['$bestPercentage', 2] },
          timeTaken: '$bestTime',
          student: {
            name: '$studentDetails.name',
            avatar: '$studentDetails.avatar'
          }
        }
      }
    ];

    const leaderboard = await Attempt.aggregate(pipeline);
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.status(200).json({ success: true, count: rankedLeaderboard.length, data: rankedLeaderboard });
  } catch (error) {
    next(error);
  }
};
