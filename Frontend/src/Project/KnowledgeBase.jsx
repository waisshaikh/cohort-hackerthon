import { useState } from "react";
import { IoSparklesOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
              <IoSparklesOutline /> AI Knowledge
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Knowledge Base Assistant</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              This page is ready for knowledge base integration once the tenant AI routes and documents are connected.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-8 shadow-xl">
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your knowledge base question..."
              className="w-full rounded-3xl border border-slate-700 bg-[#020617] py-4 pl-14 pr-4 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
            Knowledge base interaction will be available once your tenant documents and AI routes are connected.
          </div>
        </div>
      </div>
    </div>
  );
}