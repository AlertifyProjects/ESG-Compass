import { Router } from 'express';
import { createMetric, getMetrics, getMetricById, updateMetric, deleteMetric, getMetricsByFramework } from '../controllers/metricController';
import { protect, admin } from '../middleware/authMiddleware';
import { validate, metricValidation } from '../middleware/validationMiddleware';
import { paginate } from '../middleware/paginationMiddleware';

const router = Router();

router.route('/')
  .post(protect, validate(metricValidation.create), createMetric)
  .get(protect, paginate, getMetrics);

router.route('/framework/:framework')
  .get(protect, paginate, getMetricsByFramework);

router.route('/:id')
  .get(protect, getMetricById)
  .put(protect, validate(metricValidation.update), updateMetric)
  .delete(protect, deleteMetric);

export default router;