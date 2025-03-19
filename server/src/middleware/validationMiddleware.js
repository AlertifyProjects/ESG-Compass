import { object, string, number, boolean, array, required, optional, alternatives, date } from 'joi';

// User validation schemas
const userValidation = {
  register: object({
    name: string().required(),
    email: string().email().required(),
    password: string().min(6).required(),
    role: string().valid('admin', 'editor', 'viewer'),
    organization: string().required()
  }),
  login: object({
    email: string().email().required(),
    password: string().required()
  }),
  update: object({
    name: string(),
    email: string().email(),
    password: string().min(6)
  })
};

// Organization validation schemas
const organizationValidation = {
  create: object({
    name: string().required(),
    industry: string().required(),
    size: string().valid('small', 'medium', 'large', 'enterprise').required(),
    headquarters: object({
      country: string(),
      city: string()
    }),
    foundingYear: number().integer(),
    publiclyTraded: boolean(),
    stockSymbol: string(),
    subscriptionTier: string().valid('starter', 'professional', 'enterprise'),
    activeFrameworks: array().items(
      string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom')
    )
  }),
  update: object({
    name: string(),
    industry: string(),
    size: string().valid('small', 'medium', 'large', 'enterprise'),
    headquarters: object({
      country: string(),
      city: string()
    }),
    foundingYear: number().integer(),
    publiclyTraded: boolean(),
    stockSymbol: string(),
    subscriptionTier: string().valid('starter', 'professional', 'enterprise'),
    subscriptionStatus: string().valid('active', 'trialing', 'past_due', 'canceled'),
    activeFrameworks: array().items(
      string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom')
    )
  })
};

// Metric validation schemas
const metricValidation = {
  create: object({
    name: string().required(),
    description: string(),
    category: string().valid('environmental', 'social', 'governance').required(),
    subcategory: string(),
    unit: string(),
    frameworks: array().items(
      object({
        name: string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom').required(),
        identifier: string()
      })
    ),
    dataType: string().valid('number', 'boolean', 'text', 'date', 'percentage'),
    isCustom: boolean(),
    organization: string().when('isCustom', {
      is: true,
      then: required(),
      otherwise: optional()
    })
  }),
  update: object({
    name: string(),
    description: string(),
    category: string().valid('environmental', 'social', 'governance'),
    subcategory: string(),
    unit: string(),
    frameworks: array().items(
      object({
        name: string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom'),
        identifier: string()
      })
    ),
    dataType: string().valid('number', 'boolean', 'text', 'date', 'percentage')
  })
};

// Metric data validation schemas
const metricDataValidation = {
  create: object({
    metric: string().required(),
    organization: string().required(),
    value: alternatives().try(
      number(),
      boolean(),
      string(),
      date()
    ).required(),
    unit: string(),
    period: object({
      startDate: date().required(),
      endDate: date().required()
    }).required(),
    location: string(),
    dataSource: string().valid('manual', 'import', 'integration', 'calculation'),
    notes: string()
  }),
  update: object({
    value: alternatives().try(
      number(),
      boolean(),
      string(),
      date()
    ),
    unit: string(),
    period: object({
      startDate: date(),
      endDate: date()
    }),
    location: string(),
    dataSource: string().valid('manual', 'import', 'integration', 'calculation'),
    notes: string()
  }),
  verify: object({
    verificationStatus: string().valid('unverified', 'internal_review', 'external_audit', 'verified').required(),
    notes: string()
  })
};

// Report validation schemas
const reportValidation = {
  create: object({
    title: string().required(),
    description: string(),
    organization: string().required(),
    framework: string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom').required(),
    reportingPeriod: object({
      startDate: date().required(),
      endDate: date().required()
    }).required(),
    metrics: array().items(
      object({
        metric: string().required(),
        included: boolean().default(true)
      })
    )
  }),
  update: object({
    title: string(),
    description: string(),
    framework: string().valid('GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom'),
    reportingPeriod: object({
      startDate: date(),
      endDate: date()
    }),
    status: string().valid('draft', 'in_progress', 'review', 'published'),
    metrics: array().items(
      object({
        metric: string().required(),
        included: boolean().default(true)
      })
    ),
    publishedUrl: string(),
    publishedVersion: string()
  }),
  export: object({
    format: string().valid('pdf', 'excel', 'csv', 'html').required(),
    url: string().required()
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

export default {
  validate,
  userValidation,
  organizationValidation,
  metricValidation,
  metricDataValidation,
  reportValidation
};