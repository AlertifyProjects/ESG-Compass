const express = require('express');
const {
  createMetricData,
  getMetricData,
  getMetricDataById,
  updateMetricData,
  deleteMetricData,
  verifyMetricData
} = require('../controllers/metricDataController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, metricDataValidation } = require('../middleware/validationMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, validate(metricDataValidation.create), createMetricData)
  .get(protect, paginate, getMetricData);

router.route('/:id')
  .get(protect, getMetricDataById)
  .put(protect, validate(metricDataValidation.update), updateMetricData)
  .delete(protect, deleteMetricData);

router.route('/:id/verify')
  .put(protect, validate(metricDataValidation.verify), verifyMetricData);

module.exports = router;