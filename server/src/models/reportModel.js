import { Schema, model } from 'mongoose';

const reportSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    framework: {
      type: String,
      enum: ['GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom'],
      required: true,
    },
    reportingPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'review', 'published'],
      default: 'draft',
    },
    metrics: [{
      metric: {
        type: Schema.Types.ObjectId,
        ref: 'Metric',
      },
      included: {
        type: Boolean,
        default: true,
      },
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedUrl: String,
    publishedVersion: String,
    exportHistory: [{
      format: {
        type: String,
        enum: ['pdf', 'excel', 'csv', 'html'],
      },
      url: String,
      createdAt: Date,
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
  },
  {
    timestamps: true,
  }
);

const Report = model('Report', reportSchema);
export default Report;