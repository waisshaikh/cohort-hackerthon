import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    visibility: {
      type: String,
      enum: ["public", "internal"],
      default: "public",
    },
  },
  { timestamps: true },
);

messageSchema.index({ tenant: 1, ticket: 1, createdAt: 1 });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
