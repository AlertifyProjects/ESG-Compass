const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    framework: {
      type: String,
      enum: ["GRI", "SASB", "TCFD", "CDP", "SFDR", "EU_Taxonomy", "custom"],
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
      enum: ["draft", "in_progress", "review", "published"],
      default: "draft",
    },
    metrics: [
      {
        metric: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Metric",
        },
        included: {
          type: Boolean,
          default: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publishedUrl: String,
    publishedVersion: String,
    exportHistory: [
      {
        format: {
          type: String,
          enum: ["pdf", "excel", "csv", "html"],
        },
        url: String,
        createdAt: Date,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
