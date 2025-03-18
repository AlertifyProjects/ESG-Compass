import { Organization } from '../models';

// @desc    Create a new organization
// @route   POST /api/organizations
// @access  Private/Admin
const createOrganization = async (req, res) => {
  const {
    name,
    industry,
    size,
    headquarters,
    foundingYear,
    publiclyTraded,
    stockSymbol,
    subscriptionTier,
    activeFrameworks,
  } = req.body;

  const organization = await Organization.create({
    name,
    industry,
    size,
    headquarters,
    foundingYear,
    publiclyTraded,
    stockSymbol,
    subscriptionTier,
    activeFrameworks,
  });

  if (organization) {
    res.status(201).json(organization);
  } else {
    res.status(400);
    throw new Error('Invalid organization data');
  }
};

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Private/Admin
const getOrganizations = async (req, res) => {
  const organizations = await Organization.find({});
  res.json(organizations);
};

// @desc    Get organization by ID
// @route   GET /api/organizations/:id
// @access  Private
const getOrganizationById = async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  
  if (organization) {
    res.json(organization);
  } else {
    res.status(404);
    throw new Error('Organization not found');
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private/Admin
const updateOrganization = async (req, res) => {
  const organization = await Organization.findById(req.params.id);

  if (organization) {
    organization.name = req.body.name || organization.name;
    organization.industry = req.body.industry || organization.industry;
    organization.size = req.body.size || organization.size;
    organization.headquarters = req.body.headquarters || organization.headquarters;
    organization.foundingYear = req.body.foundingYear || organization.foundingYear;
    organization.publiclyTraded = req.body.publiclyTraded !== undefined 
      ? req.body.publiclyTraded 
      : organization.publiclyTraded;
    organization.stockSymbol = req.body.stockSymbol || organization.stockSymbol;
    organization.subscriptionTier = req.body.subscriptionTier || organization.subscriptionTier;
    organization.subscriptionStatus = req.body.subscriptionStatus || organization.subscriptionStatus;
    organization.activeFrameworks = req.body.activeFrameworks || organization.activeFrameworks;
    
    const updatedOrganization = await organization.save();
    res.json(updatedOrganization);
  } else {
    res.status(404);
    throw new Error('Organization not found');
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private/Admin
const deleteOrganization = async (req, res) => {
  const organization = await Organization.findById(req.params.id);

  if (organization) {
    await organization.remove();
    res.json({ message: 'Organization removed' });
  } else {
    res.status(404);
    throw new Error('Organization not found');
  }
};

export default {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};