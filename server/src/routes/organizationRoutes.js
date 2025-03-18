import { Router } from 'express';
import { createOrganization, getOrganizations, getOrganizationById, updateOrganization, deleteOrganization } from '../controllers/organizationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .post(protect, admin, createOrganization)
  .get(protect, admin, getOrganizations);

router.route('/:id')
  .get(protect, getOrganizationById)
  .put(protect, admin, updateOrganization)
  .delete(protect, admin, deleteOrganization);

export default router;