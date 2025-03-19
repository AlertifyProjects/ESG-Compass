import { Router } from 'express';
import { createReport, getReports, getReportById, updateReport, deleteReport, addReportExport, getReportData } from '../controllers/reportController';
import { protect, admin } from '../middleware/authMiddleware';
import {validate, reportValidation } from '../middleware/validationMiddleware';

const router = Router();

router.route('/')
  .post(protect, validate(reportValidation.create), createReport)
  .get(protect, getReports);

router.route('/:id')
  .get(protect, getReportById)
  .put(protect, validate(reportValidation.update), updateReport)
  .delete(protect, deleteReport);

router.route('/:id/export')
  .post(protect, validate(reportValidation.export), addReportExport);

router.route('/:id/data')
  .get(protect, getReportData);

export default router;