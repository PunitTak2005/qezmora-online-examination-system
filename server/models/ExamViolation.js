const mongoose = require('mongoose');

const examViolationSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attempt'
    },
    type: {
      type: String,
      enum: ['fullscreen_exit', 'tab_switch', 'window_blur', 'devtools_open', 'copy_paste_attempt'],
      required: true
    },
    warningNumber: {
      type: Number,
      default: 1
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ExamViolation', examViolationSchema);
