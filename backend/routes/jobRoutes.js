const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
} = require('../controllers/jobController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:id', getJob);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;