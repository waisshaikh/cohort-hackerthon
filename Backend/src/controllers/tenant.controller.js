import Tenant from "../models/tenant.model.js";
import userModel from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getWorkspace = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant workspace not found",
    });
  }

  const members = await userModel
    .find({ tenant: tenant._id })
    .select("username email role verified createdAt")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    tenant,
    members,
  });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const { name, settings, status, plan } = req.body;

  const updates = {};
  if (name) updates.name = String(name).trim();
  if (settings) updates.settings = settings;
  if (req.user.role === "superadmin" && status) updates.status = status;
  if (req.user.role === "superadmin" && plan) updates.plan = plan;

  const tenant = await Tenant.findByIdAndUpdate(req.user.tenant, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Workspace updated",
    tenant,
  });
});

export const addMember = asyncHandler(async (req, res) => {
  const { username, email, password, role = "agent" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "username, email, and password are required",
    });
  }

  if (!["admin", "agent", "customer"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "role must be admin, agent, or customer",
    });
  }

  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email or username already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
    role,
    tenant: req.user.tenant,
    verified: true,
  });

  return res.status(201).json({
    success: true,
    message: "Member added to workspace",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

export default {
  getWorkspace,
  updateWorkspace,
  addMember,
};
