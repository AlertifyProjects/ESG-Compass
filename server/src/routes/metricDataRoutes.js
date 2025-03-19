import { Router } from "express";
import {
  createMetricData,
  getMetricData,
  getMetricDataById,
  updateMetricData,
  deleteMetricData,
  verifyMetricData,
} from "../controllers/metricDataController";
import { protect, admin } from "../middleware/authMiddleware";
import {
  validate,
  metricDataValidation,
} from "../middleware/validationMiddleware";

const router = Router();

router
  .route("/")
  .post(protect, validate(metricDataValidation.create), createMetricData)
  .get(protect, getMetricData);

router
  .route("/:id")
  .get(protect, getMetricDataById)
  .put(protect, validate(metricDataValidation.update), updateMetricData)
  .delete(protect, deleteMetricData);

router
  .route("/:id/verify")
  .put(protect, validate(metricDataValidation.verify), verifyMetricData);

export default router;
