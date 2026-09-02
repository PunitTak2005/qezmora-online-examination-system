const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  icon: {
    type: String,
    required: [true, 'Please specify an icon name (e.g. Code, Calculator)'],
    default: 'BookOpen'
  },
  color: {
    type: String,
    required: [true, 'Please specify a color theme (e.g. blue, indigo)'],
    default: 'blue'
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete exams/questions or prevent deletion? We will prevent deletion if exams exist in the controller.

module.exports = mongoose.model('Category', categorySchema);
