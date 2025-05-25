const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('admin'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.put('/register/:id', protect, registerForEvent);

module.exports = router;