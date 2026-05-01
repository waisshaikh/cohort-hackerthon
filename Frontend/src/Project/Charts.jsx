import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Mon", tickets: 40, resolved: 24 },
  { name: "Tue", tickets: 30, resolved: 20 },
  { name: "Wed", tickets: 50, resolved: 35 },
  { name: "Thu", tickets: 70, resolved: 50 },
  { name: "Fri", tickets: 60, resolved: 45 },
];

const pieData = [
  { name: "Resolved", value: 70 },
  { name: "Pending", value: 30 },
];

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Title */}
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Total Tickets" value="1,240" />
          <StatCard title="Resolved" value="890" />
          <StatCard title="Pending" value="350" />
        </div>

        {/* Line Chart */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
          <h2 className="mb-4 text-gray-300">Tickets Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-2 gap-4">

          {/* Bar Chart */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
            <h2 className="mb-4 text-gray-300">Weekly Activity</h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888" />
                <Tooltip />
                <Bar dataKey="tickets" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
            <h2 className="mb-4 text-gray-300">Resolution Rate</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Stat Card */
function StatCard({ title, value }) {
  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-semibold mt-1">{value}</h2>
    </div>
  );
}