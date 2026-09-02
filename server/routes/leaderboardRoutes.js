const express = require('express');
const {
  getOverallLeaderboard,
  getExamLeaderboard
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getOverallLeaderboard);
router.get('/exam/:examId', protect, getExamLeaderboard);

module.exports = router;
