import { useState } from 'react';
import { FiSearch, FiFilter } from "react-icons/fi";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Customer Directory</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Customer management is being prepared for backend integration. This workspace will list tenant customers, contact details and support history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-60">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer..."
                className="w-full rounded-2xl border border-slate-800 bg-[#0f172a] py-3 pl-11 pr-4 text-sm text-white outline-none"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#0f172a] px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 transition">
              <FiFilter /> Filter
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-8 text-slate-400 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Customer Intelligence</h2>
              <p className="mt-2 text-sm text-slate-500">
                We will show customer usage, sentiment, and SLA status once backend endpoints are live.
              </p>
            </div>
            <button className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 transition">
              Sync data
            </button>
          </div>
          <div className="rounded-3xl border border-dashed border-slate-700 p-12 text-center text-slate-500">
            Customer directory integration coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}
