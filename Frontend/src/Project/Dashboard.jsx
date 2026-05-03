import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, MessageSquare, Search, TrendingUp,
  Users as UsersIcon, Zap, ShieldAlert, Bell, Plus, ArrowUpRight
} from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [recentTenants, setRecentTenants] = useState([]);
  const [recentCritical, setRecentCritical] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        if (isSuperAdmin) {
          const { data } = await api.get("/admin/platform-analytics");
          setAnalytics(data);
          setRecentTenants(data.recentTenants || []);
          setRecentCritical(data.recentCriticalTickets || []);
        } else {
          const [analyticsResult, ticketsResult] = await Promise.allSettled([
            api.get("/analytics/dashboard"),
            api.get("/tickets"),
          ]);
          if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value.data);
          if (ticketsResult.status === "fulfilled") setTickets(ticketsResult.value.data.tickets || []);
        }
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load dashboard"));
      } finally {
        setLoading(false);
      }
    };
    if (user) void loadDashboard();
  }, [user, isSuperAdmin]);

  const metrics = analytics?.metrics || {};
  const stats = [
    { label: "Total Tickets", value: metrics.totalTickets ?? tickets.length, icon: MessageSquare, color: "from-blue-500 to-cyan-400", bg: "blue" },
    { label: "Open Tickets", value: metrics.openTickets ?? tickets.filter((t) => ["open", "pending"].includes(t.status)).length, icon: UsersIcon, color: "from-violet-600 to-purple-400", bg: "purple" },
    { label: isSuperAdmin ? "Active Tenants" : "Resolved", value: isSuperAdmin ? metrics.activeTenants ?? 0 : metrics.resolvedTickets ?? 0, icon: isSuperAdmin ? ShieldAlert : Zap, color: "from-emerald-500 to-teal-400", bg: "emerald" },
    { label: isSuperAdmin ? "Suspended" : "Resolution Rate", value: isSuperAdmin ? metrics.suspendedTenants ?? 0 : `${metrics.resolutionRate ?? 0}%`, icon: TrendingUp, color: "from-amber-500 to-orange-400", bg: "amber" },
  ];

  const recentTickets = useMemo(() => tickets.slice(0, 5), [tickets]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 p-6 lg:p-10 max-w-[1700px] mx-auto">
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <span className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                 {isSuperAdmin ? "Super Intelligence" : "Enterprise Node"}
               </span>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div> Live
               </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              {isSuperAdmin ? "Platform Core" : "Workspace Analytics"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Deep Search..." 
                className="pl-12 pr-6 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-80 text-sm backdrop-blur-xl"
              />
            </div>
            <button className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all relative group">
              <Bell size={22} className="text-slate-400 group-hover:text-white" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
            </button>
            {!isSuperAdmin && (
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] active:scale-95">
                <Plus size={18} /> New Ticket
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-10 p-5 rounded-[2rem] border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-center gap-4 backdrop-blur-xl animate-in zoom-in-95">
            <ShieldAlert size={20} /> {error}
          </div>
        )}

        {/* Stats Grid - Ultra Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 hover:border-slate-700 transition-all duration-500 group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] blur-3xl transition-opacity`}></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-3xl bg-slate-950 border border-slate-800 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-500`}>
                  <stat.icon size={26} className="text-indigo-400" />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                   <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold mt-1">
                      <ArrowUpRight size={12} /> +12%
                   </div>
                </div>
              </div>
              
              <h3 className="text-4xl font-black tracking-tighter text-white leading-none">
                {loading ? <span className="animate-pulse">...</span> : stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        {isSuperAdmin ? (
          <div className="grid gap-10 xl:grid-cols-2">
            <SectionWrapper title="Platform Expansion" badge="Tenants">
              <div className="space-y-4">
                {recentTenants.length === 0 ? (
                  <EmptyState message="No new clusters online." />
                ) : (
                  recentTenants.map((tenant) => (
                    <div key={tenant._id} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-400">
                          {tenant.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{tenant.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tenant.plan} Plan</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                          {tenant.status}
                        </span>
                        <p className="text-[10px] text-slate-600 font-medium tracking-tight italic">v1.2.0</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionWrapper>

            <SectionWrapper title="System Critical" badge="Security">
              <div className="space-y-4">
                {recentCritical.length === 0 ? (
                  <EmptyState message="Platform shield active. Zero threats." />
                ) : (
                  recentCritical.map((ticket) => (
                    <div key={ticket._id} className="p-5 rounded-[2rem] bg-red-500/5 border border-red-500/20 flex items-center justify-between group hover:bg-red-500/10 transition-all">
                      <div>
                        <p className="font-bold text-slate-200 tracking-tight">{ticket.title}</p>
                        <p className="text-[10px] text-red-500 font-black mt-1 uppercase tracking-widest">{ticket.tenant?.name}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                         <ShieldAlert size={18} className="text-red-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionWrapper>
          </div>
        ) : (
          /* Enterprise Ticket Queue */
          <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="font-black text-white text-2xl tracking-tighter">Support Traffic</h3>
                <p className="text-sm text-slate-500 font-medium">Monitoring all active communication nodes</p>
              </div>
              <button className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-[11px] font-black uppercase tracking-[0.2em] transition-all">
                Access Archives
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[1000px] px-10 pb-10">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      <th className="text-left py-8 pb-6">Information Node</th>
                      <th className="text-left py-8 pb-6">Severity</th>
                      <th className="text-center py-8 pb-6">Protocol Status</th>
                      <th className="text-right py-8 pb-6">Ops Center</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                      <tr><td colSpan="4" className="py-20 text-center animate-pulse text-slate-500 font-black uppercase tracking-widest">Syncing Data Layers...</td></tr>
                    ) : recentTickets.length === 0 ? (
                      <tr><td colSpan="4" className="py-20"><EmptyState message="All nodes quiet. System optimized." /></td></tr>
                    ) : (
                      recentTickets.map((ticket) => <TicketRow key={ticket._id} ticket={ticket} />)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Premium UI Components ---

const SectionWrapper = ({ title, badge, children }) => (
  <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-slate-800 p-10 shadow-2xl">
    <div className="flex items-center justify-between mb-10">
      <h3 className="font-black text-white text-2xl tracking-tighter">{title}</h3>
      <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">{badge}</span>
    </div>
    {children}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 rounded-[2rem] bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6 shadow-inner">
      <Zap size={32} className="text-slate-600" />
    </div>
    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest italic">{message}</p>
  </div>
);

const TicketRow = ({ ticket }) => {
  const priorities = {
    high: "text-red-400 bg-red-400/10 border-red-400/20",
    medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };

  return (
    <tr className="group hover:bg-indigo-500/[0.02] transition-all cursor-pointer">
      <td className="py-6 pr-4">
        <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors text-lg tracking-tight truncate max-w-xs">{ticket.title}</p>
        <p className="text-xs text-slate-500 font-medium mt-1 lowercase opacity-70 italic">{ticket.customer?.email || "internal_node"}</p>
      </td>
      <td className="py-6">
        <span className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest shadow-sm ${priorities[ticket.priority?.toLowerCase()] || "text-slate-400 bg-slate-800 border-slate-700"}`}>
          {ticket.priority}
        </span>
      </td>
      <td className="py-6 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-300">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
           {ticket.status}
        </div>
      </td>
      <td className="py-6 text-right">
        <p className="text-sm font-black text-slate-200 uppercase tracking-tighter">{ticket.department}</p>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1 opacity-50 uppercase">L1 Sync Active</p>
      </td>
    </tr>
  );
};

export default Dashboard;