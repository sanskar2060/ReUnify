const SuccessStory = require('../models/SuccessStory');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all success stories
// @route   GET /api/stories
// @access  Public
exports.getStories = async (req, res, next) => {
  try {
    const stories = await SuccessStory.find({ approved: true }).populate({
      path: 'user',
      select: 'name batchYear branch profilePicture',
    });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single success story
// @route   GET /api/stories/:id
// @access  Public
exports.getStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id).populate({
      path: 'user',
      select: 'name batchYear branch profilePicture',
    });

    if (!story) {
      return next(
        new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create success story
// @route   POST /api/stories
// @access  Private
exports.createStory = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const story = await SuccessStory.create(req.body);

    res.status(201).json({
      success: true,
      data: story,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update success story
// @route   PUT /api/stories/:id
// @access  Private
exports.updateStory = async (req, res, next) => {
  try {
    let story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return next(
        new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is story owner or admin
    if (
      story.user.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this story`,
          401
        )
      );
    }

    story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete success story
// @route   DELETE /api/stories/:id
// @access  Private
exports.deleteStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return next(
        new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is story owner or admin
    if (
      story.user.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this story`,
          401
        )
      );
    }

    await story.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve success story
// @route   PUT /api/stories/approve/:id
// @access  Private/Admin
exports.approveStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return next(
        new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
      );
    }

    story.approved = true;
    await story.save();

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (err) {
    next(err);
  }
};