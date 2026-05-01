import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  TrendingUp,
  Users as UsersIcon,
  Zap,
} from "lucide-react";

import api from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [analyticsResult, ticketsResult] = await Promise.allSettled([
          api.get("/analytics/dashboard"),
          api.get("/tickets"),
        ]);

        if (analyticsResult.status === "fulfilled") {
          setAnalytics(analyticsResult.value.data);
        }

        if (ticketsResult.status === "fulfilled") {
          setTickets(ticketsResult.value.data.tickets || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = analytics?.metrics || {};
  const stats = [
    {
      label: "Total Tickets",
      value: metrics.totalTickets ?? tickets.length,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Open Tickets",
      value: metrics.openTickets ?? tickets.filter((ticket) => ["open", "pending"].includes(ticket.status)).length,
      icon: UsersIcon,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Resolved",
      value: metrics.resolvedTickets ?? tickets.filter((ticket) => ["resolved", "closed"].includes(ticket.status)).length,
      icon: Zap,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Resolution Rate",
      value: `${metrics.resolutionRate ?? 0}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const recentTickets = useMemo(() => tickets.slice(0, 5), [tickets]);

  return (
    <div className="flex min-h-full bg-slate-50 font-sans">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
            <p className="text-slate-500">
              {user?.tenant?.name || "TenantDesk"} workspace performance
            </p>
          </div>
          <div className="flex gap-4 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <Search size={18} className="text-slate-400 ml-2" />
            <input type="text" placeholder="Search data..." className="outline-none text-sm w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Recent Tickets</h3>
            <LayoutDashboard className="text-slate-300" size={20} />
          </div>

          <div className="min-w-[760px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 font-semibold text-slate-500 text-sm border-b py-4 px-8 bg-slate-50/50">
              <p>TICKET</p>
              <p>PRIORITY</p>
              <p className="text-center">STATUS</p>
              <p className="text-right">TEAM</p>
            </div>

            <div className="divide-y divide-slate-100">
              {recentTickets.length === 0 && (
                <div className="px-8 py-6 text-sm text-slate-500">
                  No tickets yet. Create one from the Tickets page.
                </div>
              )}
              {recentTickets.map((ticket) => (
                <TicketRow key={ticket._id} ticket={ticket} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TicketRow = ({ ticket }) => (
  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center px-8 py-4 hover:bg-slate-50/50 transition-colors">
    <div className="min-w-0">
      <p className="font-bold text-slate-800 leading-tight truncate">{ticket.title}</p>
      <p className="text-xs text-slate-400 truncate">{ticket.customer?.email || ticket.customer?.username || "Customer"}</p>
    </div>
    <span className="text-xs font-bold px-2.5 py-1 rounded-lg w-fit bg-indigo-50 text-indigo-600">
      {ticket.priority}
    </span>
    <p className="text-sm text-slate-500 text-center capitalize">{ticket.status}</p>
    <p className="text-sm text-slate-500 text-right truncate">{ticket.department}</p>
  </div>
);

export default Dashboard;
