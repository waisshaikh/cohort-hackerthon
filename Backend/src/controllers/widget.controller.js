import asyncHandler from "../utils/asyncHandler.js";
import Tenant from "../models/tenant.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Serves the widget.js loader script with tenant slug dynamically injected
 * GET /widget.js?tenant=TENANT_SLUG
 */
export const serveWidgetScript = asyncHandler(async (req, res) => {
  const { tenant: tenantSlug } = req.query;

  if (!tenantSlug) {
    return res.status(400).json({
      success: false,
      message: "Missing tenant parameter",
    });
  }

  // Verify tenant exists and is active
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

  try {
    const widgetPath = path.resolve(process.cwd(), "public/widget.js");

    console.log("DIRNAME:", __dirname);
    console.log("WIDGET PATH:", widgetPath);

    const widgetCode = fs.readFileSync(widgetPath, "utf-8");

    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.send(widgetCode);
  } catch (error) {
    console.error("Widget script error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load widget script",
    });
  }
});


/**
 * Serves the widget iframe HTML page
 * GET /widget-iframe.html?tenant=TENANT_SLUG
 */
export const serveWidgetIframe = asyncHandler(async (req, res) => {
  const { tenant: tenantSlug } = req.query;

  if (!tenantSlug) {
    return res.status(400).json({
      success: false,
      message: "Missing tenant parameter",
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

  try {
    const iframePath = path.resolve(process.cwd(), "public/widget-iframe.html");

    console.log("IFRAME PATH:", iframePath);

    const iframeCode = fs.readFileSync(iframePath, "utf-8");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.send(iframeCode);
  } catch (error) {
    console.error("Widget iframe error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load widget iframe",
    });
  }
});

/**
 * Get widget configuration for frontend preview
 * GET /api/public/widget/config?tenant=TENANT_SLUG
 */
export const getWidgetConfig = asyncHandler(async (req, res) => {
  const { tenant: tenantSlug } = req.query;

  if (!tenantSlug) {
    return res.status(400).json({
      success: false,
      message: "Missing tenant parameter",
    });
  }

  // Verify tenant exists and is active
  const tenant = await Tenant.findOne({ slug: tenantSlug, status: "active" });

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  const apiUrl = process.env.API_URL || "http://localhost:5000";
  const embedScript = `<script src="${apiUrl}/widget.js?tenant=${tenantSlug}"><\/script>`;

  res.status(200).json({
    success: true,
    config: {
      tenantSlug,
      embedScript,
      apiUrl,
      embedUrl: `${apiUrl}/widget.js?tenant=${tenantSlug}`,
      iframeUrl: `${apiUrl}/widget-iframe.html?tenant=${tenantSlug}`,
    },
  });
});

export default {
  serveWidgetScript,
  serveWidgetIframe,
  getWidgetConfig,
};
