import { Schema, model } from 'mongoose';

const metricDataSchema = Schema(
  {
    metric: {
      type: Schema.Types.ObjectId,
      ref: 'Metric',
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    unit: String,
    period: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    location: {
      type: String,
      default: 'global',
    }, // For organizations with multiple locations
    dataSource: {
      type: String,
      enum: ['manual', 'import', 'integration', 'calculation'],
      default: 'manual',
    },
    notes: String,
    verificationStatus: {
      type: String,
      enum: ['unverified', 'internal_review', 'external_audit', 'verified'],
      default: 'unverified',
    },
    verifiedBy: {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      date: Date,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of metric data for a specific organization, period, and location
metricDataSchema.index(
  { 
    metric: 1, 
    organization: 1, 
    'period.startDate': 1, 
    'period.endDate': 1, 
    location: 1 
  }, 
  { unique: true }
);

const MetricData = model('MetricData', metricDataSchema);
export default MetricData;