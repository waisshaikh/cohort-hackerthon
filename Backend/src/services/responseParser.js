const ALLOWED_SENTIMENTS = ["Positive", "Neutral", "Negative", "Escalated"];
const ALLOWED_PRIORITIES = ["Low", "Medium", "High", "Critical"];
const ALLOWED_CATEGORIES = [
  "Billing",
  "Technical",
  "Refund",
  "Account",
  "Complaint",
  "Feature Request",
  "General Inquiry",
];
const ALLOWED_DEPARTMENTS = [
  "Billing Support",
  "Technical Support",
  "Account Management",
  "Customer Success",
  "Escalation Team",
];

const stripMarkdownJsonFence = (rawResponse) =>
  rawResponse.replace(/```json|```/gi, "").trim();

const safeString = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const inferCategoryFromMessage = (message) => {
  const content = message.toLowerCase();

  if (/(refund|chargeback|money back)/.test(content)) return "Refund";
  if (/(bill|invoice|payment|charged|subscription|pricing)/.test(content)) {
    return "Billing";
  }
  if (/(bug|error|crash|login|technical|issue|not working|failed)/.test(content)) {
    return "Technical";
  }
  if (/(account|profile|password|sign in|signin|access)/.test(content)) {
    return "Account";
  }
  if (/(complaint|angry|frustrated|terrible|unacceptable)/.test(content)) {
    return "Complaint";
  }
  if (/(feature|enhancement|improvement|would love|request)/.test(content)) {
    return "Feature Request";
  }

  return "General Inquiry";
};

const inferSentimentFromMessage = (message) => {
  const content = message.toLowerCase();

  if (/(legal|lawsuit|cancel immediately|furious|outraged|escalate)/.test(content)) {
    return "Escalated";
  }
  if (/(angry|upset|broken|not working|terrible|unacceptable|frustrated)/.test(content)) {
    return "Negative";
  }
  if (/(thanks|thank you|appreciate|great|love)/.test(content)) {
    return "Positive";
  }

  return "Neutral";
};

const inferPriorityFromMessage = (message, category, sentiment) => {
  const content = message.toLowerCase();

  if (
    sentiment === "Escalated" ||
    /(urgent|asap|immediately|critical|security|outage|data loss)/.test(content)
  ) {
    return "Critical";
  }
  if (
    /(cannot|can't|unable|blocked|down|failed payment|refund now)/.test(content) ||
    category === "Complaint"
  ) {
    return "High";
  }
  if (category === "Feature Request" || category === "General Inquiry") {
    return "Low";
  }

  return "Medium";
};

const getDepartmentFromRules = (category, sentiment, priority) => {
  if (category === "Billing" || category === "Refund") return "Billing Support";
  if (category === "Technical") return "Technical Support";
  if (category === "Account") return "Account Management";
  if (
    category === "Complaint" &&
    (priority === "Critical" || sentiment === "Escalated")
  ) {
    return "Escalation Team";
  }
  if (category === "General Inquiry" || category === "Feature Request") {
    return "Customer Success";
  }

  return "Customer Success";
};

export const buildFallbackAnalysis = (message) => {
  const category = inferCategoryFromMessage(message);
  const sentiment = inferSentimentFromMessage(message);
  const priority = inferPriorityFromMessage(message, category, sentiment);
  const recommendedDepartment = getDepartmentFromRules(
    category,
    sentiment,
    priority
  );

  return {
    summary: safeString(message).slice(0, 140) || "Customer submitted a support request.",
    sentiment,
    priority,
    category,
    recommendedDepartment,
    suggestedReply:
      "Thank you for reaching out to TenantDesk AI support. We have reviewed your request and routed it to the appropriate team. We will follow up with the next steps as quickly as possible.",
  };
};

const normalizeField = (value, allowedValues, fallback) => {
  if (!value) return fallback;

  const matchedValue = allowedValues.find(
    (option) => option.toLowerCase() === String(value).trim().toLowerCase()
  );

  return matchedValue || fallback;
};

export const parseAiAnalysisResponse = (rawResponse, originalMessage) => {
  const fallback = buildFallbackAnalysis(originalMessage);

  try {
    const cleanedResponse = stripMarkdownJsonFence(rawResponse);
    const parsed = JSON.parse(cleanedResponse);

    const category = normalizeField(parsed.category, ALLOWED_CATEGORIES, fallback.category);
    const sentiment = normalizeField(
      parsed.sentiment,
      ALLOWED_SENTIMENTS,
      fallback.sentiment
    );
    const priority = normalizeField(
      parsed.priority,
      ALLOWED_PRIORITIES,
      fallback.priority
    );

    // The routing contract wins over any conflicting model output.
    const recommendedDepartment = getDepartmentFromRules(
      category,
      sentiment,
      priority
    );

    return {
      analysis: {
        summary: safeString(parsed.summary, fallback.summary),
        sentiment,
        priority,
        category,
        recommendedDepartment,
        suggestedReply: safeString(parsed.suggestedReply, fallback.suggestedReply),
      },
      usedFallback: false,
    };
  } catch (error) {
    return {
      analysis: fallback,
      usedFallback: true,
    };
  }
};

export default {
  buildFallbackAnalysis,
  parseAiAnalysisResponse,
};
