const express = require('express');
const {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  approveStory,
} = require('../controllers/storyController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getStories);
router.get('/:id', getStory);
router.post('/', protect, createStory);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.put('/approve/:id', protect, authorize('admin'), approveStory);

module.exports = router;