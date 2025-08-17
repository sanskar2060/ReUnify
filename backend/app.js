const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' });

// Route files
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const jobs = require('./routes/jobRoutes');
const events = require('./routes/eventRoutes');
const stories = require('./routes/storyRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/jobs', jobs);
app.use('/api/events', events);
app.use('/api/stories', stories);

// Error handling middleware
const errorHandler = require('./middlewares/error');
app.use(errorHandler);

module.exports = app;