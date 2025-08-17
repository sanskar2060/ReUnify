const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate({
      path: 'postedBy',
      select: 'name email profilePicture',
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'postedBy',
      select: 'name email profilePicture',
    });

    if (!job) {
      return next(
        new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(
        new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is job owner or admin
    if (
      job.postedBy.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this job`,
          401
        )
      );
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(
        new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is job owner or admin
    if (
      job.postedBy.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this job`,
          401
        )
      );
    }

    await job.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
exports.searchJobs = async (req, res, next) => {
  try {
    const { title, company, location } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query).populate({
      path: 'postedBy',
      select: 'name email profilePicture',
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};