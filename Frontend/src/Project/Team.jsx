export default function Team() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Team Management</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Tenant team management will appear here once the backend exposes users, roles, and agent assignment APIs.
            </p>
          </div>
          <button className="rounded-2xl border border-slate-700 bg-[#0f172a] px-5 py-3 text-sm text-slate-200 hover:bg-slate-800 transition">
            Invite agent
          </button>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-10 text-center text-slate-400 shadow-xl">
          <p className="text-lg font-semibold text-white mb-2">Team management is coming soon</p>
          <p className="max-w-xl mx-auto text-sm leading-7">
            This page will show your active tenant users, assigned agents, and role controls after the backend integration is complete.
          </p>
        </div>
      </div>
    </div>
  );
}