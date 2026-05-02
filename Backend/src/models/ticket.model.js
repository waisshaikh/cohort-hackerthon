import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: { type: String, trim: true },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative", "Escalated"],
      default: "Neutral",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: [
        "Billing",
        "Technical",
        "Refund",
        "Account",
        "Complaint",
        "Feature Request",
        "General Inquiry",
      ],
      default: "General Inquiry",
    },
    recommendedDepartment: {
      type: String,
      enum: [
        "Billing Support",
        "Technical Support",
        "Account Management",
        "Customer Success",
        "Escalation Team",
      ],
      default: "Customer Success",
    },
    suggestedReply: { type: String, trim: true },
    usedFallback: { type: Boolean, default: false },
  },
  { _id: false },
);

const ticketSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    channel: {
      type: String,
      enum: ["chat", "email", "web", "whatsapp", "phone"],
      default: "web",
    },
    source: {
      type: String,
      enum: ["WEBSITE", "WHATSAPP", "EMAIL", "LIVE_CHAT", "INSTAGRAM", "PHONE"],
      default: "WEBSITE",
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Billing",
        "Technical",
        "Refund",
        "Account",
        "Complaint",
        "Feature Request",
        "General Inquiry",
      ],
      default: "General Inquiry",
    },
    department: {
      type: String,
      default: "Customer Success",
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ai: {
      type: aiAnalysisSchema,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

ticketSchema.index({ tenant: 1, status: 1, priority: 1 });
ticketSchema.index({ tenant: 1, assignedTo: 1 });

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
