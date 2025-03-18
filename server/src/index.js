import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Import routes
import userRoutes from './routes/userRoutes';
import organizationRoutes from './routes/organizationRoutes';
import metricRoutes from './routes/metricRoutes';
import metricDataRoutes from './routes/metricDataRoutes';
import reportRoutes from './routes/reportRoutes';

config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(json());

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