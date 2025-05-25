const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);