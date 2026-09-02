const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const contactRoutes = require('./routes/contactRoutes');
const violationRoutes = require('./routes/violationRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Setup directories
const uploadsDir = path.join(__dirname, 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const profileDir = path.join(uploadsDir, 'profile');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir);
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir);

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());
// Allow cross-origin images for avatars
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Sanitize data
app.use(mongoSanitize());

// Enable Production-Ready CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:3255',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200 // limit each IP to 200 requests per windowMs
});
app.use('/api', limiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Qezmora Backend is running.',
    version: '1.0.0',
    api: '/api/health'
  });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Qezmora Backend',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/stats', statsRoutes);

// Error handler middleware (should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 9004;

app.listen(PORT, () => {
  console.log(`\x1b[33m%s\x1b[0m`, `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`\x1b[31m%s\x1b[0m`, `Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
