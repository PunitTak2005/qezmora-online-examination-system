const Category = require('../models/Category');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const categories = await Category.find(query).sort('name');

    // Get exam counts per category
    const categoryStats = await Exam.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const examCountMap = {};
    categoryStats.forEach(stat => {
      if (stat._id) examCountMap[stat._id.toString()] = stat.count;
    });

    // Calculate questions count by linking questions -> exams -> category
    const exams = await Exam.find().select('_id category');
    const examCategoryMap = {};
    exams.forEach(e => {
      if (e.category) {
        examCategoryMap[e._id.toString()] = e.category.toString();
      }
    });

    const questionCountMap = {};
    const questions = await Question.find().select('exam');
    questions.forEach(q => {
      if (q.exam && examCategoryMap[q.exam.toString()]) {
        const catId = examCategoryMap[q.exam.toString()];
        questionCountMap[catId] = (questionCountMap[catId] || 0) + 1;
      }
    });

    const categoriesWithStats = categories.map(cat => {
      return {
        ...cat.toObject(),
        examCount: examCountMap[cat._id.toString()] || 0,
        questionCount: questionCountMap[cat._id.toString()] || 0,
        status: cat.status || 'Active'
      };
    });

    res.status(200).json({
      success: true,
      count: categoriesWithStats.length,
      data: categoriesWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      const error = new Error(`Category not found with slug of ${req.params.slug}`);
      error.statusCode = 404;
      return next(error);
    }

    // Get active exams for this category
    const exams = await Exam.find({ category: category._id, status: 'published' })
      .populate('teacher', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        category,
        exams
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    // Auto generate slug if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      const customError = new Error('Category name or slug already exists');
      customError.statusCode = 400;
      return next(customError);
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      const error = new Error(`Category not found with id of ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      const customError = new Error('Category name or slug already exists');
      customError.statusCode = 400;
      return next(customError);
    }
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      const error = new Error(`Category not found with id of ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    // Check if any exams or questions use this category
    const examCount = await Exam.countDocuments({ category: category._id });
    const questionCount = await Question.countDocuments({ category: category._id });

    if (examCount > 0 || questionCount > 0) {
      const error = new Error(`Cannot delete category. It is used in ${examCount} exams and ${questionCount} questions.`);
      error.statusCode = 400;
      return next(error);
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
