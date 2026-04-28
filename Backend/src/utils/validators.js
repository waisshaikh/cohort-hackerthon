export const validateAnalyzeTicketPayload = (payload) => {
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";

  if (!message) {
    return {
      error: "message is required",
    };
  }

  if (message.length < 10) {
    return {
      error: "message must be at least 10 characters long",
    };
  }

  if (message.length > 5000) {
    return {
      error: "message must be 5000 characters or fewer",
    };
  }

  return {
    error: null,
    value: { message },
  };
};

export default {
  validateAnalyzeTicketPayload,
};
