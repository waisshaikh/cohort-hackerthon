import mongoose from "mongoose";

import AILog from "../models/aiLog.model.js";
import Message from "../models/message.model.js";
import Ticket from "../models/ticket.model.js";
import userModel from "../models/user.model.js";
import { analyzeTicket } from "../services/ai.service.js";
import { buildAnalyzeTicketPrompt } from "../services/promptBuilder.js";
import {
  buildFallbackAnalysis,
  parseAiAnalysisResponse,
} from "../services/responseParser.js";
import asyncHandler from "../utils/asyncHandler.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const canAccessTicket = (user, ticket) => {
  if (["admin", "agent", "superadmin"].includes(user.role)) return true;
  return String(ticket.customer) === String(user.id);
};

const analyzeTicketMessage = async (message, tenant, ticket = null) => {
  const prompt = buildAnalyzeTicketPrompt(message);
  let rawResponse = "";
  let parsedResponse = buildFallbackAnalysis(message);
  let usedFallback = false;

  try {
    rawResponse = await analyzeTicket(prompt);
    const parsedResult = parseAiAnalysisResponse(rawResponse, message);
    parsedResponse = parsedResult.analysis;
    usedFallback = parsedResult.usedFallback;
  } catch (error) {
    usedFallback = true;
  }

  await AILog.create({
    tenant,
    ticket,
    message,
    prompt,
    rawResponse,
    parsedResponse,
    usedFallback,
    provider: "gemini",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  return {
    ...parsedResponse,
    usedFallback,
  };
};

export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, channel = "web" } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "title and description are required",
    });
  }

  const ai = await analyzeTicketMessage(description, req.user.tenant);

  const ticket = await Ticket.create({
    tenant: req.user.tenant,
    title,
    description,
    channel,
    customer: req.user.id,
    priority: ai.priority,
    category: ai.category,
    department: ai.recommendedDepartment,
    ai,
  });

  await AILog.findOneAndUpdate(
    { tenant: req.user.tenant, ticket: null, message: description },
    { ticket: ticket._id },
    { sort: { createdAt: -1 } },
  );

  await Message.create({
    tenant: req.user.tenant,
    ticket: ticket._id,
    author: req.user.id,
    body: description,
    visibility: "public",
  });

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate("customer", "username email role")
    .populate("assignedTo", "username email role");

  return res.status(201).json({
    success: true,
    message: "Ticket created and analyzed",
    ticket: populatedTicket,
  });
});

export const listTickets = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo, q } = req.query;
  const filter = { tenant: req.user.tenant };

  if (req.user.role === "customer") {
    filter.customer = req.user.id;
  }
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo && isObjectId(assignedTo)) filter.assignedTo = assignedTo;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const tickets = await Ticket.find(filter)
    .populate("customer", "username email role")
    .populate("assignedTo", "username email role")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json({
    success: true,
    tickets,
  });
});

export const getTicket = asyncHandler(async (req, res) => {
  if (!isObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid ticket id" });
  }

  const ticket = await Ticket.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
  })
    .populate("customer", "username email role")
    .populate("assignedTo", "username email role");

  if (!ticket || !canAccessTicket(req.user, ticket)) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  const messages = await Message.find({
    tenant: req.user.tenant,
    ticket: ticket._id,
    ...(req.user.role === "customer" ? { visibility: "public" } : {}),
  })
    .populate("author", "username email role")
    .sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    ticket,
    messages,
  });
});

export const updateTicket = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "title",
    "description",
    "status",
    "priority",
    "category",
    "department",
  ];

  const updates = {};
  for (const field of allowedUpdates) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (updates.status && ["resolved", "closed"].includes(updates.status)) {
    updates.resolvedAt = new Date();
  }

  const ticket = await Ticket.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenant },
    updates,
    { new: true, runValidators: true },
  );

  if (!ticket) {
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Ticket updated",
    ticket,
  });
});

export const assignTicket = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;

  if (!isObjectId(assignedTo)) {
    return res.status(400).json({ success: false, message: "Invalid agent id" });
  }

  const agent = await userModel.findOne({
    _id: assignedTo,
    tenant: req.user.tenant,
    role: { $in: ["admin", "agent"] },
  });

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: "Agent not found in this tenant",
    });
  }

  const ticket = await Ticket.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenant },
    { assignedTo, status: "pending" },
    { new: true, runValidators: true },
  ).populate("assignedTo", "username email role");

  if (!ticket) {
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Ticket assigned",
    ticket,
  });
});

export const addMessage = asyncHandler(async (req, res) => {
  const { body, visibility = "public" } = req.body;

  if (!body) {
    return res.status(400).json({ success: false, message: "body is required" });
  }

  const ticket = await Ticket.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
  });

  if (!ticket || !canAccessTicket(req.user, ticket)) {
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }

  const safeVisibility =
    visibility === "internal" && req.user.role !== "customer" ? "internal" : "public";

  const message = await Message.create({
    tenant: req.user.tenant,
    ticket: ticket._id,
    author: req.user.id,
    body,
    visibility: safeVisibility,
  });

  return res.status(201).json({
    success: true,
    message: "Message added",
    data: message,
  });
});

export const suggestReply = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
  });

  if (!ticket || !canAccessTicket(req.user, ticket)) {
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }

  const ai = await analyzeTicketMessage(ticket.description, req.user.tenant, ticket._id);

  ticket.ai = ai;
  ticket.priority = ai.priority;
  ticket.category = ai.category;
  ticket.department = ai.recommendedDepartment;
  await ticket.save();

  return res.status(200).json({
    success: true,
    ai,
  });
});

export default {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
  assignTicket,
  addMessage,
  suggestReply,
};
