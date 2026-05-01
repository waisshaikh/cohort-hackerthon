import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";

const data = [
  { name: "Jan", users: 400, tickets: 240 },
  { name: "Feb", users: 600, tickets: 300 },
  { name: "Mar", users: 800, tickets: 500 },
  { name: "Apr", users: 700, tickets: 400 },
  { name: "May", users: 900, tickets: 650 },
];

export default function Analytics() {
  const [range, setRange] = useState("7d");

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Analytics</h1>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-[#020617] border border-gray-700 px-3 py-2 rounded-lg text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
          </select>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard title="Users" value="12.4K" change="+12%" />
          <MetricCard title="Tickets" value="3.2K" change="+8%" />
          <MetricCard title="Resolution Rate" value="78%" change="-2%" />
          <MetricCard title="Response Time" value="1.4h" change="+5%" />
        </div>

        {/* Main Chart */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
          <h2 className="mb-4 text-gray-300">Growth Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="tickets"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-gray-300 mb-2">Top Insight</h3>
            <p className="text-sm text-gray-400">
              Ticket volume increased by 20% this month. Most issues are related
              to payment failures.
            </p>
          </div>

          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-gray-300 mb-2">AI Suggestion</h3>
            <p className="text-sm text-gray-400">
              Consider improving payment gateway reliability or adding fallback
              options to reduce failures.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

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