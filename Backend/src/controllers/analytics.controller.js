import mongoose from "mongoose";

import Ticket from "../models/ticket.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isMongoConnected, memoryStore } from "../utils/memoryStore.js";

const countBy = async (tenant, field) =>
  Ticket.aggregate([
    { $match: { tenant } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    const tickets = memoryStore.tickets.filter(
      (ticket) => ticket.tenant === req.user.tenant,
    );
    const totalTickets = tickets.length;
    const openTickets = tickets.filter((ticket) =>
      ["open", "pending"].includes(ticket.status),
    ).length;
    const resolvedTickets = tickets.filter((ticket) =>
      ["resolved", "closed"].includes(ticket.status),
    ).length;
    const countBy = (field) =>
      Object.entries(
        tickets.reduce((acc, ticket) => {
          acc[ticket[field]] = (acc[ticket[field]] || 0) + 1;
          return acc;
        }, {}),
      ).map(([key, count]) => ({ _id: key, count }));

    return res.status(200).json({
      success: true,
      metrics: {
        totalTickets,
        openTickets,
        resolvedTickets,
        resolutionRate:
          totalTickets === 0 ? 0 : Math.round((resolvedTickets / totalTickets) * 100),
      },
      breakdowns: {
        byStatus: countBy("status"),
        byPriority: countBy("priority"),
        byCategory: countBy("category"),
      },
      recentCritical: tickets
        .filter((ticket) => ticket.priority === "Critical")
        .slice(0, 5),
    });
  }

  const tenant = new mongoose.Types.ObjectId(req.user.tenant);

  const [totalTickets, openTickets, resolvedTickets, byStatus, byPriority, byCategory] =
    await Promise.all([
      Ticket.countDocuments({ tenant }),
      Ticket.countDocuments({ tenant, status: { $in: ["open", "pending"] } }),
      Ticket.countDocuments({ tenant, status: { $in: ["resolved", "closed"] } }),
      countBy(tenant, "status"),
      countBy(tenant, "priority"),
      countBy(tenant, "category"),
    ]);

  const recentCritical = await Ticket.find({
    tenant,
    priority: "Critical",
    status: { $in: ["open", "pending"] },
  })
    .select("title status priority department createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  return res.status(200).json({
    success: true,
    metrics: {
      totalTickets,
      openTickets,
      resolvedTickets,
      resolutionRate:
        totalTickets === 0 ? 0 : Math.round((resolvedTickets / totalTickets) * 100),
    },
    breakdowns: {
      byStatus,
      byPriority,
      byCategory,
    },
    recentCritical,
  });
});

export default {
  getDashboardAnalytics,
};
