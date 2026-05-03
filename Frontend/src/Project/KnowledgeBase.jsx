import { useState } from "react";
import { IoSparklesOutline, IoDocumentTextOutline, IoCloudUploadOutline } from "react-icons/io5";
import { FiSearch, FiArrowRight } from "react-icons/fi";

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");

  const suggestions = [
    "How to reset password?",
    "Tenant API documentation",
    "Pricing plans 2026",
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
            <IoSparklesOutline className="animate-pulse" /> Neural Knowledge Engine
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            How can I <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">help you today?</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Instant answers from your documentation. Connect your tenant AI routes to unlock intelligent document retrieval.
          </p>
        </div>

        {/* Search & Interaction Container */}
        <div className="space-y-8">
          {/* Premium Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your knowledge base question..."
                className="w-full rounded-[2rem] border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl py-6 pl-16 pr-6 text-white outline-none focus:border-indigo-500/50 shadow-2xl transition-all text-lg placeholder:text-slate-600"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                <FiArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((text, i) => (
              <button 
                key={i}
                onClick={() => setQuery(text)}
                className="px-5 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-sm text-slate-400 transition-all font-medium"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interface Placeholder */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column: Stats/Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-white/5 bg-[#0f172a]/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <IoDocumentTextOutline size={24} />
                <span className="font-bold tracking-tight text-white">Indexing Status</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-indigo-500" />
              </div>
              <p className="text-[10px] uppercase font-black text-slate-600 tracking-widest">0 Documents Connected</p>
            </div>
            
            <button className="w-full p-6 rounded-3xl border border-dashed border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group flex flex-col items-center gap-3">
              <IoCloudUploadOutline size={32} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
              <span className="text-sm font-bold text-slate-500 group-hover:text-slate-300">Upload Knowledge</span>
            </button>
          </div>

          {/* Right Column: Interaction Area */}
          <div className="md:col-span-2 rounded-[2.5rem] border border-white/5 bg-[#0f172a]/60 backdrop-blur-2xl p-1 shadow-2xl">
            <div className="h-full rounded-[2.3rem] border border-dashed border-slate-800 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-5 bg-white/5 rounded-3xl text-slate-600">
                <IoSparklesOutline size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Waiting for Integration</h3>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed font-medium italic">
                  Once your tenant documents and AI routes are connected, you'll be able to query your own data here.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="pt-10 text-center border-t border-white/5">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
            Enterprise AI Core // Secure Document Processing
          </p>
        </div>
      </div>
    </div>
  );
}