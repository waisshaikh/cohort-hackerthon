import { useState } from "react";
import { IoSparklesOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";

export default function KnowledgeAIChat() {
  const [input, setInput] = useState("");
  const [useKB, setUseKB] = useState(true);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi 👋 I can answer using your knowledge base.",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    const aiMsg = {
      role: "assistant",
      text: useKB
        ? "Based on your knowledge base, here is the answer..."
        : "Here is a general AI response...",
      sources: useKB
        ? ["FAQ: Payment Issues", "Doc: Refund Policy"]
        : [],
    };

    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex justify-center p-6">
      <div className="w-full max-w-5xl flex gap-4">

        {/* Chat Section */}
        <div className="flex-1 flex flex-col h-[85vh]">

          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <IoSparklesOutline className="text-purple-400" />
              <h1 className="text-lg font-semibold">AI Knowledge Assistant</h1>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                Beta
              </span>
            </div>

            {/* Toggle */}
            <button
              onClick={() => setUseKB(!useKB)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                useKB
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {useKB ? "KB: ON" : "KB: OFF"}
            </button>
          </div>

          {/* Chat Box */}
          <div className="flex-1 bg-[#0f172a] border border-gray-800 rounded-2xl p-4 overflow-y-auto space-y-4">

            {messages.map((msg, i) => (
              <div key={i} className="space-y-1">
                <div
                  className={`max-w-[75%] p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-[#020617] border border-gray-700"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="text-xs text-gray-400 ml-1">
                    Sources: {msg.sources.join(", ")}
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Input */}
          <div className="mt-3 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask using knowledge base..."
              className="flex-1 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 rounded-lg flex items-center"
            >
              <FiSend />
            </button>
          </div>
        </div>

        {/* Knowledge Base Panel */}
        <div className="w-72 bg-[#0f172a] border border-gray-800 rounded-2xl p-4 hidden md:block">

          <h2 className="text-sm text-gray-300 mb-3">Knowledge Base</h2>

          <div className="space-y-2 text-sm">
            <div className="p-2 bg-[#020617] rounded-lg border border-gray-700">
              📄 Payment Issues FAQ
            </div>
            <div className="p-2 bg-[#020617] rounded-lg border border-gray-700">
              📄 Refund Policy
            </div>
            <div className="p-2 bg-[#020617] rounded-lg border border-gray-700">
              📄 Shipping Details
            </div>
          </div>

          <button className="mt-4 w-full border border-gray-700 py-2 rounded-lg text-sm">
            + Add Document
          </button>
        </div>

      </div>
    </div>
  );
}