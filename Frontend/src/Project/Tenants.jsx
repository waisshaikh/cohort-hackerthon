import { useEffect, useMemo, useState } from "react";
import {
  Building,
  Search,
  ServerCog,
  Users2,
  ShieldCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";

import api from "../lib/api";
import { getErrorMessage } from "../lib/api";

const planLabels = {
  free: "Free",
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
};

const statusLabels = {
  active: "Active",
  suspended: "Suspended",
};

const planOptions = ["free", "starter", "growth", "enterprise"];
const statusOptions = ["active", "suspended"];

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingTenant, setSavingTenant] = useState("");
  const [error, setError] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const loadTenants = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit,
      };

      if (search.trim()) params.search = search.trim();
      if (plan) params.plan = plan;
      if (status) params.status = status;

      const { data } = await api.get("/admin/tenants", { params });
      setTenants(data.tenants || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load tenants."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTenants();
  }, [page, plan, status]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setPage(1);
    await loadTenants();
  };

  const updateStatus = async (tenantId, nextStatus) => {
    setSavingTenant(tenantId);
    setError("");
    try {
      await api.patch(`/admin/tenants/${tenantId}/status`, { status: nextStatus });
      setTenants((current) =>
        current.map((tenant) =>
          tenant._id === tenantId ? { ...tenant, status: nextStatus } : tenant,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, `Unable to update tenant status.`));
    } finally {
      setSavingTenant("");
    }
  };

  const updatePlan = async (tenantId, nextPlan) => {
    setSavingTenant(tenantId);
    setError("");
    try {
      await api.patch(`/admin/tenants/${tenantId}/plan`, { plan: nextPlan });
      setTenants((current) =>
        current.map((tenant) =>
          tenant._id === tenantId ? { ...tenant, plan: nextPlan } : tenant,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, `Unable to update tenant plan.`));
    } finally {
      setSavingTenant("");
    }
  };

  const removeTenant = async (tenantId) => {
    const confirmed = window.confirm(
      "Delete this tenant and all related users, tickets, and messages? This cannot be undone.",
    );

    if (!confirmed) return;

    setSavingTenant(tenantId);
    setError("");
    try {
      await api.delete(`/admin/tenants/${tenantId}`);
      setTenants((current) => current.filter((tenant) => tenant._id !== tenantId));
      setTotal((current) => Math.max(0, current - 1));
    } catch (err) {
      setError(getErrorMessage(err, `Unable to delete tenant.`));
    } finally {
      setSavingTenant("");
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                <Building size={18} /> Tenant Management
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">Tenant Control Center</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Manage your tenant subscriptions, workspace status, and platform health from one clean admin panel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadTenants()}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/10 transition hover:bg-slate-800"
            >
              <RefreshCw size={18} /> Refresh list
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <form onSubmit={handleSearch} className="flex flex-1 flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tenant name or slug"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
                >
                  Search
                </button>
              </form>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <select
                  value={plan}
                  onChange={(e) => {
                    setPage(1);
                    setPlan(e.target.value);
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                >
                  <option value="">All plans</option>
                  {planOptions.map((option) => (
                    <option key={option} value={option}>
                      {planLabels[option]}
                    </option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value);
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {statusLabels[option]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-4xl border border-slate-200">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                <span>Tenant</span>
                <span>Plan</span>
                <span>Status</span>
                <span className="text-center">Members</span>
                <span className="text-right">Tickets</span>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading tenants…</div>
              ) : tenants.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No tenants match your filters.</div>
              ) : (
                <div className="divide-y divide-slate-200 bg-white">
                  {tenants.map((tenant) => (
                    <TenantRow
                      key={tenant._id}
                      tenant={tenant}
                      saving={savingTenant === tenant._id}
                      updateStatus={updateStatus}
                      updatePlan={updatePlan}
                      removeTenant={removeTenant}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
              <p>
                Showing {tenants.length} of {total} tenant{total === 1 ? "" : "s"}.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-2 rounded-2xl bg-slate-100">
                  Page {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-4xl border border-slate-200 bg-linear-to-br from-indigo-600 to-slate-900 p-6 text-white shadow-sm shadow-indigo-200/10">
            <div className="flex items-center gap-3">
              <ServerCog size={24} className="text-white/90" />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-indigo-200">Admin tools</p>
                <h2 className="text-2xl font-bold">Platform controls</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-6 text-indigo-100">
              <p>
                Use the tenant grid to review active customers, control plan tiers, and suspend accounts when necessary.
              </p>
              <p>
                Changes are reflected instantly in the admin backend and keep your platform isolated per tenant.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-1">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Quick stats</p>
                <p className="mt-3 text-3xl font-bold">{total}</p>
                <p className="mt-1 text-slate-200">Tenants total</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Active</p>
                <p className="mt-3 text-3xl font-bold text-emerald-300">{tenants.filter((item) => item.status === "active").length}</p>
                <p className="mt-1 text-slate-200">Visible on current page</p>
              </div>
            </div>
          </aside>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const TenantRow = ({ tenant, saving, updateStatus, updatePlan, removeTenant }) => {
  const nextStatus = tenant.status === "active" ? "suspended" : "active";

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-slate-50/80 transition-colors">
      <div>
        <p className="font-semibold text-slate-900">{tenant.name}</p>
        <p className="text-sm text-slate-500">{tenant.slug}</p>
      </div>

      <div>
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {planLabels[tenant.plan] || tenant.plan}
        </span>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
            tenant.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {statusLabels[tenant.status] || tenant.status}
        </span>
      </div>

      <div className="text-center text-slate-700 font-semibold">{tenant.memberCount ?? 0}</div>
      <div className="text-right text-slate-700 font-semibold">{tenant.ticketCount ?? 0}</div>

      <div className="col-span-full mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => updateStatus(tenant._id, nextStatus)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <ShieldCheck size={16} /> {nextStatus === "active" ? "Activate" : "Suspend"}
          </button>

          <select
            value={tenant.plan}
            onChange={(e) => updatePlan(tenant._id, e.target.value)}
            disabled={saving}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
          >
            {planOptions.map((planOption) => (
              <option key={planOption} value={planOption}>
                {planLabels[planOption]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => removeTenant(tenant._id)}
          className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
        >
          <Trash2 size={16} /> Delete tenant
        </button>
      </div>
    </div>
  );
};

export default Tenants;
