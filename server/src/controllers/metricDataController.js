import { MetricData, Metric, Organization } from '../models';

// @desc    Create new metric data
// @route   POST /api/metric-data
// @access  Private
const createMetricData = async (req, res) => {
  const {
    metric,
    organization,
    value,
    unit,
    period,
    location,
    dataSource,
    notes
  } = req.body;

  // Validate metric and organization exist
  const metricExists = await Metric.findById(metric);
  if (!metricExists) {
    res.status(404);
    throw new Error('Metric not found');
  }

  const orgExists = await Organization.findById(organization);
  if (!orgExists) {
    res.status(404);
    throw new Error('Organization not found');
  }

  // Check if data for this metric, organization, period, and location already exists
  const existingData = await MetricData.findOne({
    metric,
    organization,
    'period.startDate': period.startDate,
    'period.endDate': period.endDate,
    location: location || 'global'
  });

  if (existingData) {
    res.status(400);
    throw new Error('Data for this metric, period, and location already exists');
  }

  const metricData = await MetricData.create({
    metric,
    organization,
    value,
    unit,
    period,
    location: location || 'global',
    dataSource,
    notes,
    verificationStatus: 'unverified'
  });

  if (metricData) {
    res.status(201).json(metricData);
  } else {
    res.status(400);
    throw new Error('Invalid metric data');
  }
};

// @desc    Get all metric data
// @route   GET /api/metric-data
// @access  Private
const getMetricData = async (req, res) => {
  // Filter by organization if provided
  const filter = {};
  
  if (req.query.organization) {
    filter.organization = req.query.organization;
  }
  
  // Filter by metric if provided
  if (req.query.metric) {
    filter.metric = req.query.metric;
  }
  
  // Filter by period if provided
  if (req.query.startDate && req.query.endDate) {
    filter['period.startDate'] = { $gte: new Date(req.query.startDate) };
    filter['period.endDate'] = { $lte: new Date(req.query.endDate) };
  }
  
  // Filter by location if provided
  if (req.query.location) {
    filter.location = req.query.location;
  }



  // Get total count for pagination
    const count = await MetricData.countDocuments(filter);
  
  // Apply pagination
  const metricData = await MetricData.find(filter).skip(req.pagination,skip).limit(req.pagination.limit)
    .populate('metric', 'name category subcategory unit dataType')
    .populate('organization', 'name');
    
    res.json({
      metricData,
      page: req.pagination.page,
      pages: Math.ceil(count / req.pagination.limit),
      total: count
    });
};

// @desc    Get metric data by ID
// @route   GET /api/metric-data/:id
// @access  Private
const getMetricDataById = async (req, res) => {
  const metricData = await MetricData.findById(req.params.id)
    .populate('metric', 'name category subcategory unit dataType')
    .populate('organization', 'name')
    .populate('verifiedBy.user', 'name email');
  
  if (metricData) {
    res.json(metricData);
  } else {
    res.status(404);
    throw new Error('Metric data not found');
  }
};

// @desc    Update metric data
// @route   PUT /api/metric-data/:id
// @access  Private
const updateMetricData = async (req, res) => {
  const metricData = await MetricData.findById(req.params.id);

  if (metricData) {
    // Don't allow updating verified data unless user is admin or has verify permissions
    if (metricData.verificationStatus === 'verified' && 
        req.user.role !== 'admin' && 
        req.user.role !== 'editor') {
      res.status(403);
      throw new Error('Cannot update verified data');
    }

    metricData.value = req.body.value !== undefined ? req.body.value : metricData.value;
    metricData.unit = req.body.unit || metricData.unit;
    metricData.period = req.body.period || metricData.period;
    metricData.location = req.body.location || metricData.location;
    metricData.dataSource = req.body.dataSource || metricData.dataSource;
    metricData.notes = req.body.notes || metricData.notes;
    
    // Reset verification status if data is changed
    if (req.body.value !== undefined && 
        metricData.verificationStatus !== 'unverified') {
      metricData.verificationStatus = 'unverified';
    }
    
    const updatedMetricData = await metricData.save();
    res.json(updatedMetricData);
  } else {
    res.status(404);
    throw new Error('Metric data not found');
  }
};

// @desc    Delete metric data
// @route   DELETE /api/metric-data/:id
// @access  Private
const deleteMetricData = async (req, res) => {
  const metricData = await MetricData.findById(req.params.id);

  if (metricData) {
    // Don't allow deleting verified data unless user is admin
    if (metricData.verificationStatus === 'verified' && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Cannot delete verified data');
    }

    await metricData.remove();
    res.json({ message: 'Metric data removed' });
  } else {
    res.status(404);
    throw new Error('Metric data not found');
  }
};

// @desc    Verify metric data
// @route   PUT /api/metric-data/:id/verify
// @access  Private
const verifyMetricData = async (req, res) => {
  const metricData = await MetricData.findById(req.params.id);

  if (metricData) {
    // Only users with proper permissions can verify data
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      res.status(403);
      throw new Error('Not authorized to verify data');
    }

    metricData.verificationStatus = req.body.verificationStatus;
    metricData.verifiedBy = {
      user: req.user._id,
      date: Date.now(),
      notes: req.body.notes || ''
    };
    
    const updatedMetricData = await metricData.save();
    res.json(updatedMetricData);
  } else {
    res.status(404);
    throw new Error('Metric data not found');
  }
};

export default {
  createMetricData,
  getMetricData,
  getMetricDataById,
  updateMetricData,
  deleteMetricData,
  verifyMetricData
};