const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const getGeminiConfig = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return { apiKey, model };
};

const extractTextFromGeminiPayload = (payload) => {
  const candidateText = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!candidateText) {
    const finishReason = payload?.candidates?.[0]?.finishReason || "UNKNOWN";
    throw new Error(`Gemini returned no usable text. Finish reason: ${finishReason}`);
  }

  return candidateText;
};

export const analyzeTicket = async (prompt) => {
  const { apiKey, model } = getGeminiConfig();

  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const payload = await response.json();
  return extractTextFromGeminiPayload(payload);
};

export default {
  analyzeTicket,
};
