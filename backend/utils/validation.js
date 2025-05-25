const { check, validationResult } = require('express-validator');

// User validation rules
exports.validateUser = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'passwordHash',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  check('batchYear', 'Batch year is required').not().isEmpty().isNumeric(),
  check('branch', 'Branch is required').not().isEmpty()
];

// Login validation
exports.validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('passwordHash', 'Password is required').exists()
];

// Job validation
exports.validateJob = [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty()
];

// Event validation
exports.validateEvent = [
  check('name', 'Event name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty()
];

// Success story validation
exports.validateStory = [
  check('storyTitle', 'Story title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty()
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};