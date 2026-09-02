const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.ObjectId,
      ref: 'Exam',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Please add the question text'],
    },
    type: {
      type: String,
      enum: ['mcq', 'true-false', 'fill-blank', 'short-answer'],
      required: true,
      default: 'mcq',
    },
    options: {
      type: [String],
      // Required for MCQ
    },
    correctAnswer: {
      type: String,
      required: [true, 'Please specify the correct answer'],
    },
    marks: {
      type: Number,
      required: true,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    explanation: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: false
    },
    topic: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
