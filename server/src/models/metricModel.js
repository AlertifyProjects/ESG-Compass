import { Schema, model } from 'mongoose';

const metricSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['environmental', 'social', 'governance'],
      required: true,
    },
    subcategory: String,
    unit: String,
    frameworks: [{
      name: {
        type: String,
        enum: ['GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'EU_Taxonomy', 'custom'],
      },
      identifier: String, // e.g., "GRI 305-1" for GHG emissions
    }],
    dataType: {
      type: String,
      enum: ['number', 'boolean', 'text', 'date', 'percentage'],
      default: 'number',
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    }, // Only set if isCustom is true
  },
  {
    timestamps: true,
  }
);

const Metric = model('Metric', metricSchema);
export default Metric;