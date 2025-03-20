const express = require('express');
const {
  createMetric,
  getMetrics,
  getMetricById,
  updateMetric,
  deleteMetric,
  getMetricsByFramework
} = require('../controllers/metricController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, metricValidation } = require('../middleware/validationMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, validate(metricValidation.create), createMetric)
  .get(protect, paginate, getMetrics);

router.route('/framework/:framework')
  .get(protect, paginate, getMetricsByFramework);

router.route('/:id')
  .get(protect, getMetricById)
  .put(protect, validate(metricValidation.update), updateMetric)
  .delete(protect, deleteMetric);

module.exports = router;