import { Report, Organization, Metric, MetricData } from '../models';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  const {
    title,
    description,
    organization,
    framework,
    reportingPeriod,
    metrics
  } = req.body;

  // Validate organization exists
  const orgExists = await Organization.findById(organization);
  if (!orgExists) {
    res.status(404);
    throw new Error('Organization not found');
  }

  // Validate metrics exist if provided
  if (metrics && metrics.length > 0) {
    for (const item of metrics) {
      const metricExists = await Metric.findById(item.metric);
      if (!metricExists) {
        res.status(404);
        throw new Error(`Metric with ID ${item.metric} not found`);
      }
    }
  }

  const report = await Report.create({
    title,
    description,
    organization,
    framework,
    reportingPeriod,
    metrics: metrics || [],
    status: 'draft',
    createdBy: req.user._id,
    lastModifiedBy: req.user._id
  });

  if (report) {
    res.status(201).json(report);
  } else {
    res.status(400);
    throw new Error('Invalid report data');
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  // Filter by organization if provided
  const filter = {};
  
  if (req.query.organization) {
    filter.organization = req.query.organization;
  }
  
  // Filter by framework if provided
  if (req.query.framework) {
    filter.framework = req.query.framework;
  }
  
  // Filter by status if provided
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Get total count for pagination
  const count = await Report.countDocuments(filter);

  // Apply pagination
  const reports = await Report.find(filter).skip(req.pagination,skip).limit(req.pagination.limit)
    .populate('organization', 'name')
    .populate('createdBy', 'name')
    .populate('lastModifiedBy', 'name');
    
  res.json({
    reports,
    page: req.pagination.page,
    pages: Math.ceil(count / req.pagination.limit),
    total: count
  });
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('organization', 'name industry size')
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email')
    .populate('metrics.metric', 'name category subcategory unit');
  
  if (report) {
    res.json(report);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    // Don't allow updating published reports unless moving to draft
    if (report.status === 'published' && 
        req.body.status !== 'draft' && 
        req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Cannot update published reports');
    }

    report.title = req.body.title || report.title;
    report.description = req.body.description || report.description;
    report.framework = req.body.framework || report.framework;
    report.reportingPeriod = req.body.reportingPeriod || report.reportingPeriod;
    report.status = req.body.status || report.status;
    
    if (req.body.metrics) {
      report.metrics = req.body.metrics;
    }
    
    report.lastModifiedBy = req.user._id;
    
    // Add to export history if publishing
    if (req.body.status === 'published' && report.status !== 'published') {
      if (req.body.publishedUrl) {
        report.publishedUrl = req.body.publishedUrl;
      }
      
      if (req.body.publishedVersion) {
        report.publishedVersion = req.body.publishedVersion;
      }
    }
    
    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    // Don't allow deleting published reports unless admin
    if (report.status === 'published' && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Cannot delete published reports');
    }

    await report.remove();
    res.json({ message: 'Report removed' });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
};

// @desc    Add report export to history
// @route   POST /api/reports/:id/export
// @access  Private
const addReportExport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    const { format, url } = req.body;
    
    if (!format || !url) {
      res.status(400);
      throw new Error('Format and URL are required');
    }
    
    report.exportHistory.push({
      format,
      url,
      createdAt: Date.now(),
      createdBy: req.user._id
    });
    
    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
};

// @desc    Get report data with metric values
// @route   GET /api/reports/:id/data
// @access  Private
const getReportData = async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('organization', 'name industry size')
    .populate('metrics.metric', 'name category subcategory unit dataType');
  
  if (report) {
    // For each metric in the report, get the latest metric data
    const reportData = {
      ...report.toObject(),
      metricData: []
    };
    
    for (const metricItem of report.metrics) {
      if (metricItem.included) {
        const data = await MetricData.findOne({
          metric: metricItem.metric._id,
          organization: report.organization._id,
          'period.startDate': { $gte: report.reportingPeriod.startDate },
          'period.endDate': { $lte: report.reportingPeriod.endDate }
        }).sort({ 'period.endDate': -1 });
        
        if (data) {
          reportData.metricData.push({
            metric: metricItem.metric,
            data
          });
        }
      }
    }
    
    res.json(reportData);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
};

export default {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  addReportExport,
  getReportData
};