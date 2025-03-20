const express = require('express');
const {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, organizationValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, admin, validate(organizationValidation.create), createOrganization)
  .get(protect, admin, getOrganizations);

router.route('/:id')
  .get(protect, getOrganizationById)
  .put(protect, admin, validate(organizationValidation.update), updateOrganization)
  .delete(protect, admin, deleteOrganization);

module.exports = router;