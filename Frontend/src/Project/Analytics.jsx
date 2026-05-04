import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  BarChart,
  Bar,
  CartesianGrid,
  YAxis,
} from "recharts";
import api, { getErrorMessage } from "../lib/api";

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/analytics/dashboard");
        setOverview(data);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load analytics"));
      } finally {
        setLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  const chartData = overview?.breakdowns?.status
    ? Object.entries(overview.breakdowns.status).map(([status, count]) => ({ status, count }))
    : [];

  const barChartData = overview?.breakdowns?.categories
    ? Object.entries(overview.breakdowns.categories).map(([category, count]) => ({ category, count }))
    : [];

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Analytics</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Your tenant analytics dashboard, powered by backend metrics.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          {[
            { title: "Total Tickets", value: overview?.metrics?.totalTickets ?? "--" },
            { title: "Open Tickets", value: overview?.metrics?.openTickets ?? "--" },
            { title: "Resolved", value: overview?.metrics?.resolvedTickets ?? "--" },
            { title: "Resolution", value: overview?.metrics?.resolutionRate ? `${overview.metrics.resolutionRate}%` : "--" },
          ].map((metric) => (
            <div key={metric.title} className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">{metric.title}</p>
              <p className="text-3xl font-semibold text-white">{loading ? "..." : metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Status Breakdown</h2>
            </div>
            <div className="h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-500">Loading chart…</div>
              ) : chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-500">No breakdown data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="status" stroke="#718096" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Category Breakdown</h2>
            </div>
            <div className="h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-500">Loading chart…</div>
              ) : barChartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-500">No category data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" stroke="#718096" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#38bdf8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

/* Metric Card */
function MetricCard({ title, value, change }) {
  const isPositive = change.includes("+");

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>

      <div className="flex justify-between items-center mt-1">
        <h2 className="text-xl font-semibold">{value}</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            isPositive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}