import { Router } from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizationController";
import { protect, admin } from "../middleware/authMiddleware";
import {
  validate,
  organisazationValidation,
} from "../middleware/validationMiddleware";

const router = Router();

router
  .route("/")
  .post(
    protect,
    admin,
    validate(organisazationValidation.create),
    createOrganization
  )
  .get(protect, admin, getOrganizations);

router
  .route("/:id")
  .get(protect, getOrganizationById)
  .put(
    protect,
    admin,
    validate(organisazationValidation.update),
    updateOrganization
  )
  .delete(protect, admin, deleteOrganization);

export default router;
