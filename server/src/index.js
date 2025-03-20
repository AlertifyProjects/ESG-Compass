const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import routes
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const metricRoutes = require('./routes/metricRoutes');
const metricDataRoutes = require('./routes/metricDataRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb

// Routes
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/metric-data', metricDataRoutes);
app.use('/api/reports', reportRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('ESGCompass API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});