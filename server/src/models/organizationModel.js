import { Schema, model } from "mongoose";

const organizationSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      enum: ["small", "medium", "large", "enterprise"],
      required: true,
    },
    headquarters: {
      country: String,
      city: String,
    },
    foundingYear: Number,
    publiclyTraded: {
      type: Boolean,
      default: false,
    },
    stockSymbol: String,
    subscriptionTier: {
      type: String,
      enum: ["starter", "professional", "enterprise"],
      default: "starter",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trialing", "past_due", "canceled"],
      default: "trialing",
    },
    activeFrameworks: [
      {
        type: String,
        enum: ["GRI", "SASB", "TCFD", "CDP", "SFDR", "EU_Taxonomy", "custom"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Organization = model("Organization", organizationSchema);
export default Organization;
