const { Metric, Organization } = require('../models');

// @desc    Create a new metric
// @route   POST /api/metrics
// @access  Private
const createMetric = async (req, res) => {
  const {
    name,
    description,
    category,
    subcategory,
    unit,
    frameworks,
    dataType,
    isCustom,
    organization
  } = req.body;

  // Validate organization exists if this is a custom metric
  if (isCustom) {
    const orgExists = await Organization.findById(organization);
    if (!orgExists) {
      res.status(404);
      throw new Error('Organization not found');
    }
  }

  const metric = await Metric.create({
    name,
    description,
    category,
    subcategory,
    unit,
    frameworks,
    dataType,
    isCustom,
    organization: isCustom ? organization : null
  });

  if (metric) {
    res.status(201).json(metric);
  } else {
    res.status(400);
    throw new Error('Invalid metric data');
  }
};

// @desc    Get all metrics
// @route   GET /api/metrics
// @access  Private
const getMetrics = async (req, res) => {
  // Filter by organization if provided
  const filter = {};
  
  if (req.query.organization) {
    filter.$or = [
      { organization: req.query.organization },
      { isCustom: false }
    ];
  }
  
  // Filter by category if provided
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Filter by framework if provided
  if (req.query.framework) {
    filter["frameworks.name"] = req.query.framework;
  }

  const metrics = await Metric.find(filter);
  res.json(metrics);
};

// @desc    Get metric by ID
// @route   GET /api/metrics/:id
// @access  Private
const getMetricById = async (req, res) => {
  const metric = await Metric.findById(req.params.id);
  
  if (metric) {
    res.json(metric);
  } else {
    res.status(404);
    throw new Error('Metric not found');
  }
};

// @desc    Update metric
// @route   PUT /api/metrics/:id
// @access  Private
const updateMetric = async (req, res) => {
  const metric = await Metric.findById(req.params.id);

  if (metric) {
    // Only allow updating custom metrics or if admin
    if (!metric.isCustom && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update standard metrics');
    }

    metric.name = req.body.name || metric.name;
    metric.description = req.body.description || metric.description;
    metric.category = req.body.category || metric.category;
    metric.subcategory = req.body.subcategory || metric.subcategory;
    metric.unit = req.body.unit || metric.unit;
    metric.frameworks = req.body.frameworks || metric.frameworks;
    metric.dataType = req.body.dataType || metric.dataType;
    
    const updatedMetric = await metric.save();
    res.json(updatedMetric);
  } else {
    res.status(404);
    throw new Error('Metric not found');
  }
};

// @desc    Delete metric
// @route   DELETE /api/metrics/:id
// @access  Private
const deleteMetric = async (req, res) => {
  const metric = await Metric.findById(req.params.id);

  if (metric) {
    // Only allow deleting custom metrics or if admin
    if (!metric.isCustom && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete standard metrics');
    }

    await metric.remove();
    res.json({ message: 'Metric removed' });
  } else {
    res.status(404);
    throw new Error('Metric not found');
  }
};

// @desc    Get metrics by framework
// @route   GET /api/metrics/framework/:framework
// @access  Private
const getMetricsByFramework = async (req, res) => {
  const metrics = await Metric.find({
    "frameworks.name": req.params.framework
  });
  
  res.json(metrics);
};

module.exports = {
  createMetric,
  getMetrics,
  getMetricById,
  updateMetric,
  deleteMetric,
  getMetricsByFramework
};