import mongoose from "mongoose";

import Ticket from "../models/ticket.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const countBy = async (tenant, field) =>
  Ticket.aggregate([
    { $match: { tenant } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
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
