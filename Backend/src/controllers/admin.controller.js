import Tenant from "../models/tenant.model.js";
import Ticket from "../models/ticket.model.js";
import userModel from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const [
    totalTenants,
    activeTenants,
    suspendedTenants,
    totalUsers,
    totalTickets,
    recentTenants,
    recentCriticalTickets,
  ] = await Promise.all([
    Tenant.countDocuments(),
    Tenant.countDocuments({ status: "active" }),
    Tenant.countDocuments({ status: "suspended" }),
    userModel.countDocuments(),
    Ticket.countDocuments(),

    Tenant.find()
      .select("name slug plan status createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    Ticket.find({ priority: "Critical" })
      .populate("tenant", "name slug")
      .select("title priority status tenant createdAt")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return res.status(200).json({
    success: true,
    metrics: {
      totalTenants,
      activeTenants,
      suspendedTenants,
      totalUsers,
      totalTickets,
    },
    recentTenants,
    recentCriticalTickets,
  });
});

export default {
  getPlatformAnalytics,
};