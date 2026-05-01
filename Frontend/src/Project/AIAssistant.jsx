import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi 👋 How can I help you today?",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: "user", text: input },
      {
        role: "assistant",
        text: "I understand your issue. Let me help you with that.",
      },
    ]);

    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <IoSparklesOutline className="text-purple-400" />
            <h1 className="text-xl font-semibold">AI Assistant</h1>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>

          <button className="border border-gray-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
            <FiRefreshCw /> Reset
          </button>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-[#0f172a] border border-gray-800 rounded-2xl p-4 overflow-y-auto space-y-4">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] p-3 rounded-xl text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-purple-500 to-indigo-500"
                  : "bg-[#020617] border border-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}

        </div>

        {/* Input */}
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}