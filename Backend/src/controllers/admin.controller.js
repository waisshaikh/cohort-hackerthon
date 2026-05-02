import Tenant from "../models/tenant.model.js";
import Ticket from "../models/ticket.model.js";
import userModel from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteTenant,
  getTenantList,
  getValidPlans,
  getValidStatuses,
  isValidObjectId,
  updateTenantPlan,
  updateTenantStatus,
} from "../services/admin.service.js";

export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalTenants,
    activeTenants,
    suspendedTenants,
    totalUsers,
    totalTickets,
    ticketsToday,
    criticalTicketsCount,
    recentTenants,
    recentCriticalTickets,
  ] = await Promise.all([
    Tenant.countDocuments(),

    Tenant.countDocuments({
      status: "active",
    }),

    Tenant.countDocuments({
      status: "suspended",
    }),

    userModel.countDocuments(),

    Ticket.countDocuments(),

    Ticket.countDocuments({
      createdAt: { $gte: startOfToday },
    }),

    Ticket.countDocuments({
      priority: "Critical",
      status: { $in: ["open", "pending"] },
    }),

    Tenant.find()
      .select("name slug plan status createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    Ticket.find({
      priority: "Critical",
      status: { $in: ["open", "pending"] },
    })
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
      ticketsToday,
      criticalTicketsCount,
    },
    recentTenants,
    recentCriticalTickets,
  });
});

export const getTenants = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const { search, plan, status } = req.query;

  if (plan && !getValidPlans().includes(plan)) {
    return res.status(400).json({
      success: false,
      message: `Invalid plan. Valid plans are: ${getValidPlans().join(", ")}`,
    });
  }

  if (status && !getValidStatuses().includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Valid statuses are: ${getValidStatuses().join(", ")}`,
    });
  }

  const { tenants, total } = await getTenantList({
    page,
    limit,
    search,
    plan,
    status,
  });

  return res.status(200).json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    tenants,
  });
});

export const patchTenantStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tenant id",
    });
  }

  if (!status || !getValidStatuses().includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Valid statuses are: ${getValidStatuses().join(", ")}`,
    });
  }

  const tenant = await updateTenantStatus(id, status);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: `Tenant ${status === "suspended" ? "suspended" : "activated"} successfully`,
    tenant,
  });
});

export const patchTenantPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tenant id",
    });
  }

  if (!plan || !getValidPlans().includes(plan)) {
    return res.status(400).json({
      success: false,
      message: `Invalid plan. Valid plans are: ${getValidPlans().join(", ")}`,
    });
  }

  const tenant = await updateTenantPlan(id, plan);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Tenant plan updated successfully",
    tenant,
  });
});

export const removeTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tenant id",
    });
  }

  const tenant = await deleteTenant(id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Tenant and related data deleted successfully",
  });
});

export default {
  getPlatformAnalytics,
  getTenants,
  patchTenantStatus,
  patchTenantPlan,
  removeTenant,
};