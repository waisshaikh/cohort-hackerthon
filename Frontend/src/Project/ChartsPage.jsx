import React from "react";
import { BarChart3, PieChart, Activity, Zap, TrendingUp } from "lucide-react";

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section with Glass Effect */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-800/50 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Activity size={14} /> Analytics Engine
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              System <span className="text-indigo-500">Charts</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              Visual reporting for your support data. Connect additional analytics endpoints to unlock real-time trends and insights.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-white px-5 py-2.5 rounded-2xl border border-slate-700 transition-all active:scale-95 text-sm font-semibold">
            <TrendingUp size={18} className="text-indigo-400" /> Refresh Data
          </button>
        </div>

        {/* Main Analytics Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-1 shadow-2xl transition-all">
          {/* Background Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="p-8 md:p-10 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  <BarChart3 className="text-indigo-500" size={28} />
                  Performance Metrics
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Infrastructure ready for enterprise-grade reporting data.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-indigo-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Chart Grid */}
            <div className="grid gap-8 xl:grid-cols-2">
              {/* Card 1 */}
              <div className="group relative rounded-[2rem] border border-dashed border-slate-700/60 bg-slate-900/30 p-12 flex flex-col items-center justify-center text-center space-y-5 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all duration-300">
                <div className="p-5 bg-[#0b1120] rounded-3xl border border-slate-800 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-xl">
                  <PieChart size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-300">Distribution Overview</p>
                  <p className="text-sm text-slate-500 max-w-[240px] italic leading-relaxed">
                    Chart widgets will appear here once the backend analytics routes are extended.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-[2rem] border border-dashed border-slate-700/60 bg-slate-900/30 p-12 flex flex-col items-center justify-center text-center space-y-5 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all duration-300">
                <div className="p-5 bg-[#0b1120] rounded-3xl border border-slate-800 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-xl">
                  <Zap size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-300">Real-time Velocity</p>
                  <p className="text-sm text-slate-500 max-w-[240px] italic leading-relaxed">
                    Add ticket volume, resolution rate, and customer sentiment graphs.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="mt-10 pt-6 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">API Status: Operational</span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.1em]">TenantDesk AI v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}