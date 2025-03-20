import { Router } from 'express';
import { createReport, getReports, getReportById, updateReport, deleteReport, addReportExport, getReportData } from '../controllers/reportController';
import { protect, admin } from '../middleware/authMiddleware';
import {validate, reportValidation } from '../middleware/validationMiddleware';
import{paginate}from'../middleware/paginationMiddleware';

const router = Router();

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
  .get(protect, paginate, getReportData);

export default router;