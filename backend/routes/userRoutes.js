const express = require('express');
const {
  getUsers,
  getUser,
  searchUsers,
  connectUser,
  getConnections,
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUser);
router.put('/connect/:id', protect, connectUser);
router.get('/connections/all', protect, getConnections);

module.exports = router;