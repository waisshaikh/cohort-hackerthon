import mongoose from "mongoose";

import AILog from "../models/aiLog.model.js";
import Tenant from "../models/tenant.model.js";
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
import {
  isMongoConnected,
  makeId,
  memoryStore,
  publicUser,
  saveMemoryStore,
} from "../utils/memoryStore.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const canAccessTicket = (user, ticket) => {
  if (["admin", "agent", "superadmin"].includes(user.role)) return true;
  return String(ticket.customer) === String(user.id);
};

const getMemoryUser = (userId) =>
  memoryStore.users.find((user) => user.id === String(userId));

const decorateMemoryTicket = (ticket) => ({
  ...ticket,
  _id: ticket.id,
  customer: getMemoryUser(ticket.customer)
    ? publicUser(getMemoryUser(ticket.customer))
    : ticket.customer,
  assignedTo: ticket.assignedTo && getMemoryUser(ticket.assignedTo)
    ? publicUser(getMemoryUser(ticket.assignedTo))
    : ticket.assignedTo,
});

const decorateMemoryMessage = (message) => ({
  ...message,
  _id: message.id,
  author: getMemoryUser(message.author)
    ? publicUser(getMemoryUser(message.author))
    : message.author,
});

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

  if (!isMongoConnected()) {
    const ai = {
      ...buildFallbackAnalysis(description),
      usedFallback: true,
    };
    const now = new Date();
    const ticket = {
      id: makeId(),
      _id: null,
      tenant: req.user.tenant,
      title,
      description,
      channel,
      customer: req.user.id,
      assignedTo: null,
      status: "open",
      priority: ai.priority,
      category: ai.category,
      department: ai.recommendedDepartment,
      ai,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };
    const message = {
      id: makeId(),
      tenant: req.user.tenant,
      ticket: ticket.id,
      author: req.user.id,
      body: description,
      visibility: "public",
      createdAt: now,
    };

    memoryStore.tickets.unshift(ticket);
    memoryStore.messages.push(message);
    saveMemoryStore();

    return res.status(201).json({
      success: true,
      message: "Ticket created and analyzed",
      ticket: decorateMemoryTicket(ticket),
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

  if (!isMongoConnected()) {
    const query = String(q || "").toLowerCase();
    const tickets = memoryStore.tickets
      .filter((ticket) => ticket.tenant === req.user.tenant)
      .filter((ticket) => req.user.role === "customer" ? ticket.customer === req.user.id : true)
      .filter((ticket) => status ? ticket.status === status : true)
      .filter((ticket) => priority ? ticket.priority === priority : true)
      .filter((ticket) => assignedTo ? ticket.assignedTo === assignedTo : true)
      .filter((ticket) =>
        query
          ? `${ticket.title} ${ticket.description}`.toLowerCase().includes(query)
          : true,
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100)
      .map(decorateMemoryTicket);

    return res.status(200).json({
      success: true,
      tickets,
    });
  }

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
  if (!isMongoConnected()) {
    const ticket = memoryStore.tickets.find(
      (item) => item.id === req.params.id && item.tenant === req.user.tenant,
    );

    if (!ticket || !canAccessTicket(req.user, ticket)) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const messages = memoryStore.messages
      .filter((message) => message.ticket === ticket.id && message.tenant === req.user.tenant)
      .filter((message) => req.user.role === "customer" ? message.visibility === "public" : true)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(decorateMemoryMessage);

    return res.status(200).json({
      success: true,
      ticket: decorateMemoryTicket(ticket),
      messages,
    });
  }

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

  if (!isMongoConnected()) {
    const ticket = memoryStore.tickets.find(
      (item) => item.id === req.params.id && item.tenant === req.user.tenant,
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    Object.assign(ticket, updates, { updatedAt: new Date() });
    saveMemoryStore();

    return res.status(200).json({
      success: true,
      message: "Ticket updated",
      ticket: decorateMemoryTicket(ticket),
    });
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

  if (!isMongoConnected()) {
    const agent = memoryStore.users.find(
      (user) =>
        user.id === assignedTo &&
        user.tenant === req.user.tenant &&
        ["admin", "agent"].includes(user.role),
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found in this tenant",
      });
    }

    const ticket = memoryStore.tickets.find(
      (item) => item.id === req.params.id && item.tenant === req.user.tenant,
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.assignedTo = assignedTo;
    ticket.status = "pending";
    ticket.updatedAt = new Date();
    saveMemoryStore();

    return res.status(200).json({
      success: true,
      message: "Ticket assigned",
      ticket: decorateMemoryTicket(ticket),
    });
  }

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

  if (!isMongoConnected()) {
    const ticket = memoryStore.tickets.find(
      (item) => item.id === req.params.id && item.tenant === req.user.tenant,
    );

    if (!ticket || !canAccessTicket(req.user, ticket)) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    const safeVisibility =
      visibility === "internal" && req.user.role !== "customer" ? "internal" : "public";
    const message = {
      id: makeId(),
      tenant: req.user.tenant,
      ticket: ticket.id,
      author: req.user.id,
      body,
      visibility: safeVisibility,
      createdAt: new Date(),
    };

    memoryStore.messages.push(message);
    saveMemoryStore();

    return res.status(201).json({
      success: true,
      message: "Message added",
      data: decorateMemoryMessage(message),
    });
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
  if (!isMongoConnected()) {
    const ticket = memoryStore.tickets.find(
      (item) => item.id === req.params.id && item.tenant === req.user.tenant,
    );

    if (!ticket || !canAccessTicket(req.user, ticket)) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    const ai = {
      ...buildFallbackAnalysis(ticket.description),
      usedFallback: true,
    };

    ticket.ai = ai;
    ticket.priority = ai.priority;
    ticket.category = ai.category;
    ticket.department = ai.recommendedDepartment;
    ticket.updatedAt = new Date();
    saveMemoryStore();

    return res.status(200).json({
      success: true,
      ai,
    });
  }

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

const normalizeHostname = (value) => {
  if (!value) return null;

  try {
    const url =
      value.startsWith("http://") || value.startsWith("https://")
        ? new URL(value)
        : new URL(`https://${value}`);

    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
};

export const createPublicTicket = asyncHandler(async (req, res) => {
  const { tenantSlug } = req.params;
  const { name, email, title, description, channel = "web" } = req.body;

  if (!name || !email || !title || !description) {
    return res.status(400).json({
      success: false,
      message: "name, email, title, and description are required",
    });
  }

  const tenant = await Tenant.findOne({
    slug: tenantSlug,
    status: "active",
  });

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  // Domain restriction for verified widget integrations
  if (
    tenant.websiteIntegration?.isVerified &&
    tenant.websiteIntegration?.domain
  ) {
    const requestOrigin = req.headers.origin || req.headers.referer || "";

    const incomingHost = normalizeHostname(requestOrigin);
    const verifiedHost = normalizeHostname(
      tenant.websiteIntegration.domain
    );

    if (!incomingHost || !verifiedHost) {
      return res.status(403).json({
        success: false,
        message: "Unable to validate request domain",
      });
    }

    const allowedHosts = [
      verifiedHost,
      `www.${verifiedHost}`,
    ];

    if (!allowedHosts.includes(incomingHost)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized domain for this widget",
      });
    }
  }

  let customer = await userModel.findOne({
    email,
    tenant: tenant._id,
    role: "CUSTOMER",
  });

  if (!customer) {
    customer = await userModel.create({
      username: `${name.replace(/\s+/g, "").toLowerCase()}_${Date.now()}`,
      email,
      password: Math.random().toString(36).slice(-10),
      role: "CUSTOMER",
      tenant: tenant._id,
      verified: true,
    });
  }

  const ai = await analyzeTicketMessage(description, tenant._id);

  const sourceMap = {
    widget: "WIDGET",
    web: "WEBSITE",
    email: "EMAIL",
    whatsapp: "WHATSAPP",
    phone: "PHONE",
  };

  const source = sourceMap[channel] || "WEBSITE";

  const ticket = await Ticket.create({
    tenant: tenant._id,
    title,
    description,
    channel,
    source,
    customer: customer._id,
    priority: ai.priority,
    category: ai.category,
    department: ai.recommendedDepartment,
    ai,
  });

  await Message.create({
    tenant: tenant._id,
    ticket: ticket._id,
    author: customer._id,
    body: description,
    visibility: "public",
  });

  return res.status(201).json({
    success: true,
    message: "Ticket submitted successfully",
    ticket,
  });
});