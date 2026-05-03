import crypto from "crypto";
import dns from "dns/promises";

import Tenant from "../models/tenant.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const setupDnsIntegration = asyncHandler(async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({
      success: false,
      message: "Domain is required",
    });
  }

  const verificationToken = crypto.randomBytes(16).toString("hex");

  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  // Set websiteIntegration object with all required fields
  tenant.websiteIntegration = {
    domain: domain.toLowerCase().trim(),
    verificationToken,
    isVerified: false,
    verifiedAt: null,
    connectionMethod: "DNS",
    cmsType: "",
  };

  // Explicitly save the tenant document
  await tenant.save();

  // Debug logging to confirm persistence
  console.log("Saved Website Integration:", tenant.websiteIntegration);

  res.status(200).json({
    success: true,
    message: "DNS verification setup created",
    verification: {
      type: "TXT",
      host: "_tenantdesk-verify",
      value: verificationToken,
      domain: tenant.websiteIntegration.domain,
      fullDomain: `_tenantdesk-verify.${tenant.websiteIntegration.domain}`,
    },
  });
});

export const verifyDnsIntegration = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant?.websiteIntegration?.domain) {
    return res.status(400).json({
      success: false,
      message: "No domain configured for DNS verification",
    });
  }

  const domain = tenant.websiteIntegration.domain;
  const expectedToken = tenant.websiteIntegration.verificationToken;
  const lookupDomain = `_tenantdesk-verify.${domain}`;

 // logs for debug //

//   console.log(`Verifying DNS for: ${lookupDomain}`);
//   console.log(`Expected token: ${expectedToken}`);

  let records = [];

  try {
    // Use a custom public DNS resolver to avoid system/ISP resolver issues
    const resolver = new dns.Resolver();
    resolver.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);

    console.log("Using DNS Servers:", resolver.getServers());
    console.log("Lookup Domain:", lookupDomain);
   

    records = await resolver.resolveTxt(lookupDomain);
  
  } catch (error) {
    console.error("DNS lookup error:", error.message);
    return res.status(400).json({
      success: false,
      message: "TXT record not found yet. DNS may still be propagating.",
      details: error.message,
    });
  }

  // Normalize values: flatten array, remove quotes (Hostinger returns quoted TXT), and trim
  const flattened = records
    .flat()
    .map(record => record.replace(/^"|"$/g, "").trim());

  

  // Check if any normalized record contains the expected token
  const tokenFound = flattened.some(record => record.includes(expectedToken));

  if (!tokenFound) {
    return res.status(400).json({
      success: false,
      message: "Verification token not found in DNS records",
      found: flattened,
      expected: expectedToken,
    });
  }

  // Mark as verified and save
  tenant.websiteIntegration.isVerified = true;
  tenant.websiteIntegration.verifiedAt = new Date();
  await tenant.save();

  console.log("DNS verification successful for:", domain);
 

  res.status(200).json({
    success: true,
    message: "Domain verified successfully",
    websiteIntegration: {
      domain: tenant.websiteIntegration.domain,
      isVerified: tenant.websiteIntegration.isVerified,
      verifiedAt: tenant.websiteIntegration.verifiedAt,
      connectionMethod: tenant.websiteIntegration.connectionMethod,
    },
  });
});

export const setupCmsIntegration = asyncHandler(async (req, res) => {
  const { cmsType } = req.body;

  if (!cmsType) {
    return res.status(400).json({
      success: false,
      message: "CMS type is required",
    });
  }

  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  // Update websiteIntegration with CMS settings
  tenant.websiteIntegration = {
    ...tenant.websiteIntegration,
    connectionMethod: "CMS",
    cmsType,
    isVerified: true,
    verifiedAt: new Date(),
  };

  await tenant.save();

  console.log("CMS integration configured:", tenant.websiteIntegration);

  res.status(200).json({
    success: true,
    message: "CMS integration configured",
    websiteIntegration: {
      connectionMethod: tenant.websiteIntegration.connectionMethod,
      cmsType: tenant.websiteIntegration.cmsType,
      isVerified: tenant.websiteIntegration.isVerified,
      verifiedAt: tenant.websiteIntegration.verifiedAt,
    },
  });
});

export const getIntegrationStatus = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenant);

  res.status(200).json({
    success: true,
    tenantSlug: tenant.slug,
    websiteIntegration: tenant.websiteIntegration,
  });
});