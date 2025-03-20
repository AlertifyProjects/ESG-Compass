const Joi = require('joi');

// User validation schemas
const userValidation = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'editor', 'viewer'),
    organization: Joi.string().required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  update: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6)
  })
};

// Organization validation schemas
const organizationValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    industry: Joi.string().required(),
    size: Joi.string().valid('small', 'medium', 'large', 'enterprise').required(),
    headquarters: Joi.object({
      country: Joi.string(),
      city: Joi.string()
    }),
    foundingYear: Joi.number().integer(),
    publiclyTraded: Joi.boolean(),
    stockSymbol: Joi.string(),
    subscriptionTier: Joi.string().valid('starter', 'professional', 'enterprise'),
    activeFrameworks: Joi.array().items(
      Joi.string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom')
    )
  }),
  update: Joi.object({
    name: Joi.string(),
    industry: Joi.string(),
    size: Joi.string().valid('small', 'medium', 'large', 'enterprise'),
    headquarters: Joi.object({
      country: Joi.string(),
      city: Joi.string()
    }),
    foundingYear: Joi.number().integer(),
    publiclyTraded: Joi.boolean(),
    stockSymbol: Joi.string(),
    subscriptionTier: Joi.string().valid('starter', 'professional', 'enterprise'),
    subscriptionStatus: Joi.string().valid('active', 'trialing', 'past_due', 'canceled'),
    activeFrameworks: Joi.array().items(
      Joi.string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom')
    )
  })
};

// Metric validation schemas
const metricValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string().valid('environmental', 'social', 'governance').required(),
    subcategory: Joi.string(),
    unit: Joi.string(),
    frameworks: Joi.array().items(
      Joi.object({
        name: Joi.string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom').required(),
        identifier: Joi.string()
      })
    ),
    dataType: Joi.string().valid('number', 'boolean', 'text', 'date', 'percentage'),
    isCustom: Joi.boolean(),
    organization: Joi.string().when('isCustom', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }),
  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string().valid('environmental', 'social', 'governance'),
    subcategory: Joi.string(),
    unit: Joi.string(),
    frameworks: Joi.array().items(
      Joi.object({
        name: Joi.string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom'),
        identifier: Joi.string()
      })
    ),
    dataType: Joi.string().valid('number', 'boolean', 'text', 'date', 'percentage')
  })
};

// Metric data validation schemas
const metricDataValidation = {
  create: Joi.object({
    metric: Joi.string().required(),
    organization: Joi.string().required(),
    value: Joi.alternatives().try(
      Joi.number(),
      Joi.boolean(),
      Joi.string(),
      Joi.date()
    ).required(),
    unit: Joi.string(),
    period: Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().required()
    }).required(),
    location: Joi.string(),
    dataSource: Joi.string().valid('manual', 'import', 'integration', 'calculation'),
    notes: Joi.string()
  }),
  update: Joi.object({
    value: Joi.alternatives().try(
      Joi.number(),
      Joi.boolean(),
      Joi.string(),
      Joi.date()
    ),
    unit: Joi.string(),
    period: Joi.object({
      startDate: Joi.date(),
      endDate: Joi.date()
    }),
    location: Joi.string(),
    dataSource: Joi.string().valid('manual', 'import', 'integration', 'calculation'),
    notes: Joi.string()
  }),
  verify: Joi.object({
    verificationStatus: Joi.string().valid('unverified', 'internal_review', 'external_audit', 'verified').required(),
    notes: Joi.string()
  })
};

// Report validation schemas
const reportValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    organization: Joi.string().required(),
    framework: Joi.string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom').required(),
    reportingPeriod: Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().required()
    }).required(),
    metrics: Joi.array().items(
      Joi.object({
        metric: Joi.string().required(),
        included: Joi.boolean().default(true)
      })
    )
  }),
  update: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    framework: Joi.string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom'),
    reportingPeriod: Joi.object({
      startDate: Joi.date(),
      endDate: Joi.date()
    }),
    status: Joi.string().valid('draft', 'in_progress', 'review', 'published'),
    metrics: Joi.array().items(
      Joi.object({
        metric: Joi.string().required(),
        included: Joi.boolean().default(true)
      })
    ),
    publishedUrl: Joi.string(),
    publishedVersion: Joi.string()
  }),
  export: Joi.object({
    format: Joi.string().valid('pdf', 'excel', 'csv', 'html').required(),
    url: Joi.string().required()
  })
};

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  next();
};

module.exports = {
  validate,
  userValidation,
  organizationValidation,
  metricValidation,
  metricDataValidation,
  reportValidation
};