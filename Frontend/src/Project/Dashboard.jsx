import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  TrendingUp,
  Users as UsersIcon,
  Zap,
  ShieldAlert,
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

          if (analyticsResult.status === "fulfilled") {
            setAnalytics(analyticsResult.value.data);
          }

          if (ticketsResult.status === "fulfilled") {
            setTickets(ticketsResult.value.data.tickets || []);
          }
        }
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load dashboard"));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      void loadDashboard();
    }
  }, [user, isSuperAdmin]);

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
      value:
        metrics.openTickets ?? tickets.filter((ticket) => ["open", "pending"].includes(ticket.status)).length,
      icon: UsersIcon,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: isSuperAdmin ? "Active Tenants" : "Resolved",
      value: isSuperAdmin ? metrics.activeTenants ?? 0 : metrics.resolvedTickets ?? 0,
      icon: isSuperAdmin ? ShieldAlert : Zap,
      color: isSuperAdmin ? "text-emerald-600" : "text-green-600",
      bg: isSuperAdmin ? "bg-emerald-100" : "bg-green-100",
    },
    {
      label: isSuperAdmin ? "Suspended Tenants" : "Resolution Rate",
      value: isSuperAdmin ? metrics.suspendedTenants ?? 0 : `${metrics.resolutionRate ?? 0}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const recentTickets = useMemo(() => tickets.slice(0, 5), [tickets]);

  return (
    <div className="flex min-h-full bg-slate-50 font-sans">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isSuperAdmin ? "Platform Overview" : "Admin Overview"}
            </h1>
            <p className="text-slate-500">
              {isSuperAdmin
                ? "TenantDesk platform performance and health"
                : `${user?.tenant?.name || "TenantDesk"} workspace performance`}
            </p>
          </div>
          <div className="flex gap-4 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <Search size={18} className="text-slate-400 ml-2" />
            <input type="text" placeholder="Search data..." className="outline-none text-sm w-48" />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : stat.value}</h3>
            </div>
          ))}
        </div>

        {isSuperAdmin ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Recent Tenants</h3>
                <span className="text-xs text-slate-500">Latest signups</span>
              </div>
              <div className="space-y-3">
                {recentTenants.length === 0 ? (
                  <div className="text-sm text-slate-500">No recent tenants available.</div>
                ) : (
                  recentTenants.map((tenant) => (
                    <div key={tenant._id} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                      <p className="font-semibold text-slate-800">{tenant.name}</p>
                      <p className="text-xs text-slate-500">{tenant.slug}</p>
                      <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {tenant.plan} • {tenant.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Recent Critical Tickets</h3>
                <span className="text-xs text-slate-500">Open or pending</span>
              </div>
              <div className="space-y-3">
                {recentCritical.length === 0 ? (
                  <div className="text-sm text-slate-500">No critical ticket alerts.</div>
                ) : (
                  recentCritical.map((ticket) => (
                    <div key={ticket._id} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                      <p className="font-semibold text-slate-800">{ticket.title}</p>
                      <p className="text-xs text-slate-500">{ticket.tenant?.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
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
                {loading && (
                  <div className="px-8 py-6 text-sm text-slate-500">Loading recent tickets...</div>
                )}
                {!loading && recentTickets.length === 0 && (
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
        )}
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
