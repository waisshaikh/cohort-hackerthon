import AILog from "../models/aiLog.model.js";
import { analyzeTicket } from "../services/ai.service.js";
import { buildAnalyzeTicketPrompt } from "../services/promptBuilder.js";
import {
  buildFallbackAnalysis,
  parseAiAnalysisResponse,
} from "../services/responseParser.js";
import { validateAnalyzeTicketPayload } from "../utils/validators.js";

export const analyzeTicketController = async (req, res) => {
  const { error, value } = validateAnalyzeTicketPayload(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const prompt = buildAnalyzeTicketPrompt(value.message);
  let rawResponse = "";
  let parsedResponse = buildFallbackAnalysis(value.message);
  let usedFallback = false;

  try {
    rawResponse = await analyzeTicket(prompt);
    const parsedResult = parseAiAnalysisResponse(rawResponse, value.message);
    parsedResponse = parsedResult.analysis;
    usedFallback = parsedResult.usedFallback;
  } catch (serviceError) {
    usedFallback = true;
    console.error("AI analysis failed, using fallback:", serviceError.message);
  }

  try {
    await AILog.create({
      message: value.message,
      prompt,
      rawResponse,
      parsedResponse,
      usedFallback,
      provider: "gemini",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
  } catch (logError) {
    console.error("Failed to save AI log:", logError.message);
  }

  return res.status(200).json(parsedResponse);
};
