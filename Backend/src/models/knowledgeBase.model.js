import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema(
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
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

knowledgeBaseSchema.index({ tenant: 1, title: "text", content: "text", tags: 1 });

const KnowledgeBase =
  mongoose.models.KnowledgeBase ||
  mongoose.model("KnowledgeBase", knowledgeBaseSchema);

export default KnowledgeBase;
