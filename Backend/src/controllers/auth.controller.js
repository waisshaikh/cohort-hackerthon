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
  const { username, email, password, tenantName, role = "admin" } = req.body;

  if (!isMongoConnected()) {
    const existingUser = memoryStore.users.find(
      (user) => user.email === email.toLowerCase() || user.username === username,
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        err: "User already exists",
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
      role: ["admin", "agent", "customer"].includes(role) ? role : "admin",
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
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const tenant = await Tenant.create({
    name: tenantName || `${username}'s Workspace`,
    slug: uniqueSlug(tenantName || username),
  });

  const user = await userModel.create({
    username,
    email,
    password,
    role: ["admin", "agent", "customer"].includes(role) ? role : "admin",
    tenant: tenant._id,
    verified: process.env.REQUIRE_EMAIL_VERIFICATION === "true" ? false : true,
  });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    getJwtSecret(),
  );

  if (process.env.REQUIRE_EMAIL_VERIFICATION === "true") {
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
      <h2>Verify Email</h2>
      <a href="http://localhost:5000/api/auth/verify-email?token=${emailVerificationToken}">
        Click to verify
      </a>
    `,
    });
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

  if (!isMongoConnected()) {
    const user = memoryStore.users.find(
      (item) => item.email === email.toLowerCase(),
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
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
        ...publicUser(user),
        tenant: getTenant(user.tenant),
      },
      token,
    });
  }

  const user = await userModel.findOne({ email });

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

  res.status(200).json({
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

export async function getMe(req, res) {
  const userId = req.user.id;

  if (!isMongoConnected()) {
    const user = memoryStore.users.find((item) => item.id === userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      user: {
        ...publicUser(user),
        tenant: getTenant(user.tenant),
      },
    });
  }

  const user = await userModel.findById(userId)
    .select("-password")
    .populate("tenant", "name slug plan status settings");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }

    user.verified = true;
    await user.save();

    return res.send(`
      <h1>Email Verified Successfully!</h1>
      <a href="http://localhost:3000/login">Go to Login</a>
    `);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}

export default {
  register,
  login,
  getMe,
  verifyEmail,
};
