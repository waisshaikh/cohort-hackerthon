import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUsers } from "react-icons/fi";
import api from "../lib/api";

const MetricCard = ({ label, value, color }) => (
  <div className="rounded-xl border border-slate-800 bg-[#0B1120] px-4 py-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`mt-1 text-sm font-semibold ${color || "text-white"}`}>
      {value}
    </p>
  </div>
);

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data } = await api.get("/customers");
        setCustomers(data.customers || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.username?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-black text-white">
              Customer <span className="text-indigo-500">Directory</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Track all customers who submitted support tickets.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-[#0f172a] py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Directory */}
        <div className="rounded-[2rem] border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
          {loading ? (
            <div className="text-center py-20 text-slate-400">
              Loading customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <FiUsers className="mx-auto text-slate-700" size={48} />
              <p className="text-slate-500">No customers found.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer._id}
                  className="rounded-2xl border border-slate-800 bg-[#020617] p-6 hover:border-indigo-500/40 transition"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {customer.username}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {customer.email}
                      </p>
                    </div>

                    <span className="text-xs text-slate-500">
                      Joined {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      label="Total Tickets"
                      value={customer.totalTickets}
                    />

                    <MetricCard
                      label="Open Tickets"
                      value={customer.openTickets}
                    />

                    <MetricCard
                      label="Priority"
                      value={customer.highestPriority}
                      color={getPriorityColor(customer.highestPriority)}
                    />

                    <MetricCard
                      label="Last Active"
                      value={new Date(
                        customer.lastActive
                      ).toLocaleDateString()}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}