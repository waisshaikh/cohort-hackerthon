import mongoose from "mongoose";

import Message from "../models/message.model.js";
import Ticket from "../models/ticket.model.js";
import Tenant from "../models/tenant.model.js";
import userModel from "../models/user.model.js";

const validPlans = ["free", "starter", "growth", "enterprise"];
const validStatuses = ["active", "suspended"];

export const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const getTenantList = async ({ page = 1, limit = 20, search, plan, status }) => {
  const match = {};

  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");
    match.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  if (plan) {
    match.plan = plan;
  }

  if (status) {
    match.status = status;
  }

  const skip = (page - 1) * limit;

  const aggregation = await Tenant.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        tenants: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              let: { tenantId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$tenant", "$$tenantId"] } } },
                { $count: "count" },
              ],
              as: "memberStats",
            },
          },
          {
            $lookup: {
              from: "tickets",
              let: { tenantId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$tenant", "$$tenantId"] } } },
                { $count: "count" },
              ],
              as: "ticketStats",
            },
          },
          {
            $addFields: {
              memberCount: {
                $ifNull: [{ $arrayElemAt: ["$memberStats.count", 0] }, 0],
              },
              ticketCount: {
                $ifNull: [{ $arrayElemAt: ["$ticketStats.count", 0] }, 0],
              },
            },
          },
          {
            $project: {
              memberStats: 0,
              ticketStats: 0,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const result = aggregation[0] || { tenants: [], total: [] };

  return {
    tenants: result.tenants,
    total: result.total[0] ? result.total[0].count : 0,
  };
};

export const updateTenantStatus = async (tenantId, status) => {
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  return Tenant.findByIdAndUpdate(
    tenantId,
    { status },
    { new: true, runValidators: true },
  );
};

export const updateTenantPlan = async (tenantId, plan) => {
  if (!validPlans.includes(plan)) {
    throw new Error("Invalid plan value");
  }

  return Tenant.findByIdAndUpdate(
    tenantId,
    { plan },
    { new: true, runValidators: true },
  );
};

export const deleteTenant = async (tenantId) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) {
    return null;
  }

  await Promise.all([
    userModel.deleteMany({ tenant: tenant._id }),
    Ticket.deleteMany({ tenant: tenant._id }),
    Message.deleteMany({ tenant: tenant._id }),
    Tenant.findByIdAndDelete(tenant._id),
  ]);

  return tenant;
};

export const getValidPlans = () => validPlans;
export const getValidStatuses = () => validStatuses;
