import React from "react";

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Charts</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Visual reporting for your support data will be available here. Connect additional analytics endpoints to unlock charts and trends.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-8 text-slate-300 shadow-xl">
          <div className="border-b border-slate-700 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Performance charts</h2>
            <p className="mt-2 text-sm text-slate-500">
              This page is ready for reporting data once backend analytics routes are extended.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
              Chart widgets will appear here.
            </div>
            <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
              Add ticket volume, resolution rate, and customer sentiment graphs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
