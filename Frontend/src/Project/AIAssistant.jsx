import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";

import api, { getErrorMessage } from "../lib/api";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi. Send me a support message and I will classify it.",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: userMessage }]);

    try {
      const { data } = await api.post("/ai/analyze-ticket", {
        message: userMessage,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: [
            `Priority: ${data.priority}`,
            `Category: ${data.category}`,
            `Sentiment: ${data.sentiment}`,
            `Team: ${data.recommendedDepartment}`,
            "",
            data.suggestedReply,
          ].join("\n"),
        },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: getErrorMessage(err, "Unable to analyze this message"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        text: "Hi. Send me a support message and I will classify it.",
      },
    ]);
  };

  return (
    <div className="min-h-full bg-[#0b1120] text-white flex justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col h-[86vh]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <IoSparklesOutline className="text-purple-400" />
            <h1 className="text-xl font-semibold">AI Assistant</h1>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <button
            onClick={reset}
            className="border border-gray-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>

        <div className="flex-1 bg-[#0f172a] border border-gray-800 rounded-2xl p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`max-w-[75%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-purple-500 to-indigo-500"
                  : "bg-[#020617] border border-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="max-w-[75%] p-3 rounded-xl text-sm bg-[#020617] border border-gray-700">
              Analyzing...
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Paste a customer support issue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            className="flex-1 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 rounded-lg disabled:opacity-60"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
