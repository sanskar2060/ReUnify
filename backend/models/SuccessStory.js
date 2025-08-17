const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  storyTitle: {
    type: String,
    required: [true, 'Please add a story title'],
  },
  content: {
    type: String,
    required: [true, 'Please add story content'],
  },
  image: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);