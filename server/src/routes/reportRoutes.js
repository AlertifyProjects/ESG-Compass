const express = require('express');
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  addReportExport,
  getReportData
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, reportValidation } = require('../middleware/validationMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, validate(reportValidation.create), createReport)
  .get(protect, paginate, getReports);

router.route('/:id')
  .get(protect, getReportById)
  .put(protect, validate(reportValidation.update), updateReport)
  .delete(protect, deleteReport);

router.route('/:id/export')
  .post(protect, validate(reportValidation.export), addReportExport);

router.route('/:id/data')
  .get(protect, getReportData);

module.exports = router;