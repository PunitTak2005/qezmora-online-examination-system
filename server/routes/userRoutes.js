const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  getStudentStats,
  getTeacherStats,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  uploadAvatar,
  removeAvatar
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { isAdmin, isAdminOrTeacher } = require('../middleware/roleCheck');

const router = express.Router();

// Profile management routes for all authenticated users
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.patch('/change-password', protect, changeUserPassword);

// Avatar management routes (Support PATCH & POST for avatar upload/replace, DELETE for removal)
router.patch('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/profile/avatar', protect, removeAvatar);
router.delete('/avatar', protect, removeAvatar);

// Stats routes
router.get('/dashboard-stats', protect, isAdmin, getDashboardStats);
router.get('/stats/admin', protect, isAdmin, getDashboardStats);
router.get('/stats/student', protect, getStudentStats);
router.get('/student-stats', protect, getStudentStats);
router.get('/stats/teacher', protect, isAdminOrTeacher, getTeacherStats);
router.get('/teacher-stats', protect, isAdminOrTeacher, getTeacherStats);

// Admin user management routes (Requires Admin)
router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.put('/:id', protect, isAdmin, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
