const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an exam title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'Please specify duration in minutes'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Please specify total marks'],
    },
    passingMarks: {
      type: Number,
      required: [true, 'Please specify passing marks'],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    instructions: {
      type: String,
    },
    selectionMode: {
      type: String,
      enum: ['manual', 'random'],
      default: 'manual'
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    shuffleOptions: {
      type: Boolean,
      default: false
    },
    distributionRules: [{
      category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: 1
      }
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to check if exam is currently active
examSchema.virtual('isActive').get(function () {
  if (this.status !== 'published') return false;
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  return true;
});

module.exports = mongoose.model('Exam', examSchema);
