import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "starter", "growth", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    settings: {
      departments: {
        type: [String],
        default: [
          "Billing Support",
          "Technical Support",
          "Account Management",
          "Customer Success",
          "Escalation Team",
        ],
      },
      slaHours: {
        low: { type: Number, default: 72 },
        medium: { type: Number, default: 48 },
        high: { type: Number, default: 24 },
        critical: { type: Number, default: 4 },
      },
    },
    websiteIntegration: {
  domain: {
    type: String,
    trim: true,
    lowercase: true,
    default: "",
  },
  verificationToken: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  connectionMethod: {
    type: String,
    enum: ["DNS", "CMS", ""],
    default: "",
  },
  cmsType: {
    type: String,
    enum: ["WORDPRESS", "SHOPIFY", "WIX", "WEBFLOW", "FRAMER", "CUSTOM", ""],
    default: "",
  },
},
  },
  { timestamps: true },
);

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
