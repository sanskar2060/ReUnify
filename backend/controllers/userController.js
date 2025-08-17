const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res, next) => {
  try {
    const { name, batchYear, branch, profession, location } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (batchYear) {
      query.batchYear = batchYear;
    }

    if (branch) {
      query.branch = { $regex: branch, $options: 'i' };
    }

    if (profession) {
      query.profession = { $regex: profession, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Connect with user
// @route   PUT /api/users/connect/:id
// @access  Private
exports.connectUser = async (req, res, next) => {
  try {
    const userToConnect = await User.findById(req.params.id);

    if (!userToConnect) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if already connected
    if (
      req.user.connections.includes(req.params.id) ||
      userToConnect.connections.includes(req.user.id)
    ) {
      return next(new ErrorResponse('Already connected with this user', 400));
    }

    // Add to connections
    req.user.connections.push(req.params.id);
    await req.user.save();

    res.status(200).json({
      success: true,
      data: req.user.connections,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user connections
// @route   GET /api/users/connections
// @access  Private
exports.getConnections = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'connections',
      select: 'name email profession profilePicture',
    });

    res.status(200).json({
      success: true,
      count: user.connections.length,
      data: user.connections,
    });
  } catch (err) {
    next(err);
  }
};