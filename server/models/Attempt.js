const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    exam: {
      type: mongoose.Schema.ObjectId,
      ref: 'Exam',
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedAnswer: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ['in-progress', 'submitted'],
      default: 'submitted'
    },
    generatedQuestions: [
      {
        question: {
          type: mongoose.Schema.ObjectId,
          ref: 'Question'
        },
        shuffledOptions: [String]
      }
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
    },
    percentage: {
      type: Number,
    },
    passed: {
      type: Boolean,
    },
    timeTaken: {
      type: Number, // in seconds
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate derived values
attemptSchema.pre('save', async function (next) {
  // Assume score and totalMarks are set before saving.
  // Calculate percentage
  if (this.totalMarks > 0) {
    this.percentage = (this.score / this.totalMarks) * 100;
  } else {
    this.percentage = 0;
  }
  
  // We need to auto-calculate 'passed' based on Exam passingMarks
  // To do this we populate the exam in the controller and pass down values, 
  // or we handle it purely in controller before calling save().
  // Here we just ensure percentage is accurate.
  
  next();
});

module.exports = mongoose.model('Attempt', attemptSchema);
