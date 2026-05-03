import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Tenant from "../models/tenant.model.js";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import {
  getTenant,
  isMongoConnected,
  makeId,
  memoryStore,
  publicUser,
  saveMemoryStore,
} from "../utils/memoryStore.js";
import { uniqueSlug } from "../utils/slug.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
};

export async function register(req, res) {
  const { username, email, password, tenantName } = req.body;

  if (!isMongoConnected()) {
    const existingUser = memoryStore.users.find(
      (user) =>
        user.email === email.toLowerCase() || user.username === username,
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
      });
    }

    const tenant = {
      id: makeId(),
      _id: null,
      name: tenantName || `${username}'s Workspace`,
      slug: uniqueSlug(tenantName || username),
      plan: "starter",
      status: "active",
      settings: {},
    };

    const user = {
      id: makeId(),
      username,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      role: "TENANT_ADMIN",
      tenant: tenant.id,
      verified: true,
      createdAt: new Date(),
    };

    memoryStore.tenants.push(tenant);
    memoryStore.users.push(user);
    saveMemoryStore();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        ...publicUser(user),
        tenant,
      },
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists",
      success: false,
    });
  }

  const tenant = await Tenant.create({
    name: tenantName || `${username}'s Workspace`,
    slug: uniqueSlug(tenantName || username),
  });

  const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";

  const user = await userModel.create({
    username,
    email,
    password,
    role: "TENANT_ADMIN",
    tenant: tenant._id,
    verified: requireVerification ? false : true,
  });

  // ✅ EMAIL SEND FIXED
  if (requireVerification) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      getJwtSecret(),
      { expiresIn: "1d" },
    );

    const result = await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your email:</p>
        <a href="http://localhost:5000/api/auth/verify-email?token=${token}">
          Verify Email
        </a>
      `,
    });

    console.log("EMAIL RESULT:", result);
  }

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
      },
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const emailNormalized = email.trim().toLowerCase();

  const user = await userModel.findOne({
    email: emailNormalized,
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email",
      success: false,
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      tenant: user.tenant,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      tenant: user.tenant,
    },
    token,
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    let user = null;

    if (decoded.id) {
      user = await userModel.findById(decoded.id);
    }

    if (!user && decoded.email) {
      user = await userModel.findOne({ email: decoded.email });
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }

    user.verified = true;
    await user.save();

    return res.send(`
      <h1>Email Verified Successfully</h1>
      <a href="http://localhost:3000/login">Go to Login</a>
    `);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
}

export async function getMe(req, res) {
  const user = await userModel
    .findById(req.user.id)
    .select("-password")
    .populate("tenant", "name slug");

  res.json({
    success: true,
    user,
  });
}

export const inviteAgent = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const agent = await userModel.create({
      username,
      email,
      password,
      role: "AGENT",
      tenant: req.user.tenant,
      verified: true,
    });

    res.status(201).json({
      success: true,
      message: "Agent invited successfully",
      user: {
        id: agent._id,
        username: agent.username,
        email: agent.email,
        role: agent.role,
        tenant: agent.tenant,
      },
    });
  } catch (error) {
    console.error("Invite agent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to invite agent",
    });
  }
};

export const listAgents = async (req, res) => {
  try {
    const agents = await userModel.find({
      tenant: req.user.tenant,
      role: "AGENT",
    })
    .select("-password")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch agents",
    });
  }
};

export default {
  register,
  login,
  verifyEmail,
  getMe,
};
