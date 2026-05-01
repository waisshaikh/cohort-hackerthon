import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    sentiment: {
      type: String,
      required: true,
      enum: ["Positive", "Neutral", "Negative", "Escalated"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Billing",
        "Technical",
        "Refund",
        "Account",
        "Complaint",
        "Feature Request",
        "General Inquiry",
      ],
    },
    recommendedDepartment: {
      type: String,
      required: true,
      enum: [
        "Billing Support",
        "Technical Support",
        "Account Management",
        "Customer Success",
        "Escalation Team",
      ],
    },
    suggestedReply: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const aiLogSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
      index: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    rawResponse: {
      type: String,
      default: "",
    },
    parsedResponse: {
      type: aiAnalysisSchema,
      required: true,
    },
    usedFallback: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      default: "gemini",
      trim: true,
    },
    model: {
      type: String,
      default: "gemini-2.5-flash",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AILog = mongoose.models.AILog || mongoose.model("AILog", aiLogSchema);

export default AILog;
